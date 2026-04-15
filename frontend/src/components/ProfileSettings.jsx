import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getProfile, updateProfile } from "../services/api";
import toast from "react-hot-toast";
import { User } from "lucide-react";

export default function ProfileSettings({ profileUpdated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ weight: "", height: "", daily_calorie_goal: 2000 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getProfile().then((res) => {
        if (res.data?.profile) {
            setForm({ weight: res.data.profile.weight || "", height: res.data.profile.height || "", daily_calorie_goal: res.data.profile.daily_calorie_goal || 2000 });
        }
      }).finally(() => setLoading(false));
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success("Profile parameters synced.");
      setOpen(false);
      if (profileUpdated) profileUpdated(form);
      window.location.reload(); // Refresh the state seamlessly
    } catch {
      toast.error("Failed to sync profile parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-none border-primary text-primary bg-black hover:bg-primary/20 hover:text-primary transition-colors uppercase tracking-widest text-xs">
          <User size={16} /> Metrics
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-none border border-white/10 bg-black text-white p-6">
        <DialogHeader>
          <DialogTitle className="uppercase text-primary font-bold tracking-widest text-sm">Configure Profile Metrics</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid py-4 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="weight" className="uppercase text-xs tracking-widest text-white/70">Body Weight (kg)</Label>
            <Input id="weight" type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="height" className="uppercase text-xs tracking-widest text-white/70">Height (cm)</Label>
            <Input id="height" type="number" step="0.1" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="daily_calorie_goal" className="uppercase text-xs tracking-widest text-white/70">Daily Calorie Target</Label>
            <Input id="daily_calorie_goal" type="number" value={form.daily_calorie_goal} onChange={(e) => setForm({ ...form, daily_calorie_goal: e.target.value })} className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white" />
          </div>
          <Button type="submit" disabled={loading} className="mt-4 w-full rounded-none bg-primary text-black hover:bg-primary/80 uppercase tracking-widest font-bold">
            {loading ? "Syncing..." : "Apply Metrics"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
