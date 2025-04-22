
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const handleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-2xl font-bold text-brand-800">Get Started</h2>
      <p className="text-gray-600 text-center max-w-md">
        Sign in to access your dashboard and start collecting testimonials
      </p>
      <Button onClick={handleAuth} size="lg" className="bg-brand-600 hover:bg-brand-700">
        Sign in with Google
      </Button>
    </div>
  );
}
