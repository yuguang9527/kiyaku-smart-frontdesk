
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HotelLogo from "@/components/HotelLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background washi-bg">
      <div className="text-center mb-8">
        <HotelLogo size="lg" />
      </div>
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-display text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">ページが見つかりません</p>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link to="/">トップページへ戻る</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
