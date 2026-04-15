import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Zap } from "lucide-react";
import { getAiSuggestion } from "../services/api";

export default function AITrainerCard() {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSuggestion = async () => {
    setLoading(true);
    setSuggestion("");
    try {
        const res = await getAiSuggestion();
        setSuggestion(res.data.suggestion);
    } catch {
        setSuggestion("L'IA est actuellement indisponible.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card className="rounded-none border border-primary/50 bg-black shadow-none w-full h-full text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary uppercase tracking-widest text-sm font-bold">
          <Zap className="w-4 h-4" /> Coach IA
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full justify-between gap-4">
        {suggestion ? (
          <p className="text-white/80 text-sm leading-relaxed tracking-wide">{suggestion}</p>
        ) : (
          <p className="text-white/50 text-xs uppercase tracking-widest">Prêt à découvrir votre prochain défi ?</p>
        )}
        <Button 
          onClick={fetchSuggestion} 
          disabled={loading} 
          variant="outline"
          className="w-full mt-auto rounded-none border-primary text-primary hover:bg-primary/20 hover:text-primary transition-colors uppercase tracking-widest text-xs"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Générer Entraînement
        </Button>
      </CardContent>
    </Card>
  );
}
