import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AdminNav from '@/components/admin/AdminNav';
import { InfoIcon, Phone, PhoneCall, Server } from 'lucide-react';
import TwilioSimulator from '@/components/admin/TwilioSimulator';

const TwilioSetup: React.FC = () => {
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+16504850336');
  const [testNumber, setTestNumber] = useState('');
  const { toast } = useToast();

  // Twilioの設定を保存
  const handleSaveConfig = () => {
    // 実際のアプリでは、ここで設定をバックエンドに保存します
    // この例ではローカルステートのみを使用
    
    toast({
      title: "Twilio設定を保存しました",
      description: "設定が正常に保存されました。これで電話連携が有効になります。",
    });
  };

  // テスト通話を実行
  const handleTestCall = () => {
    if (!testNumber) {
      toast({
        title: "電話番号が必要です",
        description: "テスト通話を行うには、有効な電話番号を入力してください。",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "テスト通話を開始",
      description: `${testNumber}に発信しています...実際のTwilioアカウントが必要です`,
    });
    
    // 実際のTwilioセットアップ時は、ここでAPIを呼び出して発信します
  };

  return (
    <div className="flex min-h-screen flex-col washi-bg">
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-display text-primary">Twilio 電話連携設定</h1>
          <p className="text-muted-foreground mt-1">
            AIによる電話応対システムを設定します
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                <span>Twilioアカウント設定</span>
              </CardTitle>
              <CardDescription>
                Twilioのアカウント情報を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-sid">Account SID</Label>
                <Input
                  id="account-sid"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-token">Auth Token</Label>
                <Input
                  id="auth-token"
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number">Twilio電話番号</Label>
                <Input
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+16504850336"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800 mt-4">
                <div className="flex gap-2">
                  <InfoIcon className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">重要: Twilioの設定方法</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>Twilioアカウントを作成し、電話番号を購入します</li>
                      <li>電話番号の設定でWebhook URLを設定します</li>
                      <li>Voice設定でHTTP POSTを選択します</li>
                      <li>WebhookのURLを <code className="bg-amber-100 px-1">/api/twilio/voice</code> に設定します</li>
                      <li>ステータスコールバックも同様に設定してください</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">キャンセル</Button>
              <Button onClick={handleSaveConfig}>設定を保存</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                <span>テスト通話</span>
              </CardTitle>
              <CardDescription>
                設定をテストするために、テスト通話を実行できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-number">テスト用電話番号</Label>
                <Input
                  id="test-number"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="+818012345678"
                />
                <p className="text-sm text-muted-foreground">
                  国際形式で入力してください（例: +81 80 1234 5678）
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full flex items-center gap-2"
                onClick={handleTestCall}
                disabled={!testNumber || !accountSid || !authToken}
              >
                <Phone className="h-5 w-5" />
                <span>テスト通話を実行</span>
              </Button>
            </CardFooter>
          </Card>

          {/* シミュレータカードを追加 */}
          <TwilioSimulator />
        </div>
      </main>
    </div>
  );
};

export default TwilioSetup;
