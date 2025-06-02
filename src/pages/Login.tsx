
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Settings, Ticket } from "lucide-react";
import HotelLogo from "@/components/HotelLogo";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loginType, setLoginType] = useState<"guest" | "admin">("guest");
  const [reservationNumber, setReservationNumber] = useState("");
  const [hasReservation, setHasReservation] = useState(true);

  const translations = {
    login: {
      ja: 'ログイン',
      en: 'Login'
    },
    signInToContinue: {
      ja: 'アカウントにサインインして続行してください',
      en: 'Sign in to your account to continue'
    },
    email: {
      ja: 'メールアドレス',
      en: 'Email'
    },
    password: {
      ja: 'パスワード',
      en: 'Password'
    },
    noAccount: {
      ja: 'まだアカウントをお持ちでない方は',
      en: "Don't have an account?"
    },
    signUp: {
      ja: '新規登録',
      en: 'Sign Up'
    },
    admin: {
      ja: '管理者',
      en: 'Admin'
    },
    guest: {
      ja: 'ゲスト',
      en: 'Guest'
    },
    reservationNumber: {
      ja: '予約番号',
      en: 'Reservation Number'
    },
    enterReservationNumber: {
      ja: '予約番号を入力してください',
      en: 'Enter your reservation number'
    },
    continueAsGuest: {
      ja: 'ゲストとして続ける',
      en: 'Continue as Guest'
    },
    guestWithReservation: {
      ja: 'ご予約済みのお客様はこちら',
      en: 'I have a reservation'
    },
    guestWithoutReservation: {
      ja: 'まだご予約されていない方はこちら',
      en: 'I don\'t have a reservation yet'
    },
    continue: {
      ja: '続ける',
      en: 'Continue'
    }
  };

  const handleReservationLogin = () => {
    if (!reservationNumber.trim()) {
      toast({
        title: language === 'ja' ? '予約番号が必要です' : 'Reservation number required',
        description: language === 'ja' ? '予約番号を入力してください' : 'Please enter your reservation number',
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: language === 'ja' ? 'ゲストとしてログイン' : 'Logged in as guest',
      description: language === 'ja' ? '予約番号で確認しました' : 'Verified with reservation number',
    });
    navigate('/customer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginType === "admin") {
      toast({
        title: language === 'ja' ? '管理者としてログイン' : 'Logged in as admin',
        description: language === 'ja' ? '管理画面に移動します' : 'Redirecting to admin dashboard',
      });
      navigate('/admin');
    } else if (loginType === "guest") {
      if (hasReservation && !reservationNumber.trim()) {
        toast({
          title: language === 'ja' ? '予約番号が必要です' : 'Reservation number required',
          description: language === 'ja' ? '予約番号を入力してください' : 'Please enter your reservation number',
          variant: "destructive",
        });
        return;
      }
      
      if (hasReservation) {
        toast({
          title: language === 'ja' ? 'ゲストとしてログイン' : 'Logged in as guest',
          description: language === 'ja' ? '予約番号で確認しました' : 'Verified with reservation number',
        });
      } else {
        toast({
          title: language === 'ja' ? 'ゲストとしてアクセス' : 'Accessing as guest',
          description: language === 'ja' ? '予約なしでアクセスします' : 'Accessing without reservation',
        });
      }
      navigate('/customer');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background washi-bg p-4 bg-gradient-to-b from-blue-300 via-blue-100 to-white relative overflow-hidden">
      {/* Sun rays */}
      <div className="absolute left-10 top-0 w-96 h-96 bg-gradient-to-b from-amber-200 to-transparent opacity-20 rounded-full blur-xl"></div>
      
      {/* Background decoration */}
      <div className="absolute w-full h-full z-0">
        <div className="absolute right-[5%] top-[15%] transform -rotate-12 opacity-20">
          <Ticket className="h-16 w-16 text-blue-600" />
        </div>
      </div>
      
      <Card className="w-full max-w-md z-10 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <HotelLogo />
          </div>
        </CardHeader>
        
        <Tabs defaultValue="guest" className="w-full" onValueChange={(value) => setLoginType(value as "guest" | "admin")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="guest" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span>{translations.guest[language]}</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>{translations.admin[language]}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guest">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col space-y-2 border rounded-md p-4">
                    <Button 
                      type="button"
                      variant={hasReservation ? "default" : "outline"}
                      onClick={() => setHasReservation(true)}
                      className="justify-start text-left h-auto py-3 px-4"
                    >
                      <span>{translations.guestWithReservation[language]}</span>
                    </Button>
                    
                    {hasReservation && (
                      <div className="pt-2 space-y-3 px-2">
                        <Label htmlFor="reservation-number">{translations.reservationNumber[language]}</Label>
                        <div className="relative">
                          <Ticket className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="reservation-number"
                            placeholder={translations.enterReservationNumber[language]}
                            value={reservationNumber}
                            onChange={(e) => setReservationNumber(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Button 
                          type="button"
                          onClick={handleReservationLogin}
                          className="w-full"
                        >
                          {translations.login[language]}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <Button 
                      type="button"
                      variant={!hasReservation ? "default" : "outline"}
                      onClick={() => setHasReservation(false)}
                      className="justify-start text-left h-auto py-3 px-4 w-full"
                    >
                      <span>{translations.guestWithoutReservation[language]}</span>
                    </Button>
                  </div>
                </div>
                
                {!hasReservation && (
                  <Button type="submit" className="w-full">
                    {translations.continue[language]}
                  </Button>
                )}
              </CardContent>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">{translations.email[language]}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      placeholder="admin@yotta.com"
                      type="email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">{translations.password[language]}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type="password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {translations.login[language]}
                </Button>
              </CardContent>
            </form>

            <CardFooter className="flex justify-center pt-0">
              <p className="text-sm text-muted-foreground text-center">
                {translations.noAccount[language]}{' '}
                <Button variant="link" className="px-1" onClick={() => toast({
                  title: language === 'ja' ? '機能準備中' : 'Feature in development',
                  description: language === 'ja' ? '新規登録機能は現在開発中です' : 'Sign up functionality is under development',
                })}>
                  {translations.signUp[language]}
                </Button>
              </p>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
