
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AdminNav from '@/components/admin/AdminNav';
import { InfoIcon, Phone, PhoneCall, Server, Mic, Radio } from 'lucide-react';
import TwilioSimulator from '@/components/admin/TwilioSimulator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';

const TwilioSetup: React.FC = () => {
  const [accountSid, setAccountSid] = useState('AC81e62b3089fa4a6d77985129b3036000');
  const [authToken, setAuthToken] = useState('47004d9657e812409aa2890c540ad521');
  const [phoneNumber, setPhoneNumber] = useState('+14788001081');
  const [testNumber, setTestNumber] = useState('');
  const [assemblyApiKey, setAssemblyApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('wss://yourdomain.com:8765');
  const { toast } = useToast();
  const { language } = useLanguage();

  // Twilio設定の保存
  const handleSaveConfig = () => {
    // 実際のアプリケーションでは、ここで設定をバックエンドに保存します
    // このサンプルでは、ローカルステートのみを使用します
    
    toast({
      title: "Twilio設定が保存されました",
      description: "設定の保存に成功しました。電話連携が有効になりました。",
    });
  };

  // テスト通話を実行
  const handleTestCall = () => {
    if (!testNumber) {
      toast({
        title: "電話番号が必要です",
        description: "テスト通話のために有効な電話番号を入力してください",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "テスト通話を開始します",
      description: `${testNumber}に発信中...実際のTwilioアカウントが必要です`,
    });
    
    // 実際のTwilio設定では、ここでAPIを呼び出して発信を行います
  };

  // AssemblyAI設定の保存
  const handleSaveAssemblyConfig = () => {
    if (!assemblyApiKey) {
      toast({
        title: "APIキーが必要です",
        description: "有効なAssemblyAI APIキーを入力してください",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "AssemblyAI設定が保存されました",
      description: "リアルタイム音声認識の設定が正常に保存されました。",
    });
  };

  return (
    <div className="flex min-h-screen flex-col washi-bg">
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-display text-primary">Twilio & AssemblyAI 音声連携設定</h1>
          <p className="text-muted-foreground mt-1">
            AI電話応対システムとリアルタイム音声認識の設定
          </p>
        </div>

        <Tabs defaultValue="twilio">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="twilio">Twilio 設定</TabsTrigger>
            <TabsTrigger value="assembly">AssemblyAI リアルタイム音声認識</TabsTrigger>
          </TabsList>
          
          <TabsContent value="twilio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <span>Twilioアカウント設定</span>
                </CardTitle>
                <CardDescription>
                  Twilioアカウント情報を入力してください
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
                    placeholder="+14788001081"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Media Streams WebSocket URL</Label>
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="wss://yourdomain.com:8765"
                  />
                  <p className="text-sm text-muted-foreground">
                    リアルタイム音声ストリームを受信するためのWebSocketサーバーURL
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800 mt-4">
                  <div className="flex gap-2">
                    <InfoIcon className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">重要：Twilio Media Streams設定方法</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Twilioアカウントを作成し、電話番号を購入する</li>
                        <li>&lt;Stream&gt;タグを使用するTwiMLアプリを設定する</li>
                        <li>WebSocket URL: <code className="bg-amber-100 px-1">{webhookUrl}</code>を追加する</li>
                        <li>&lt;Start&gt;&lt;Stream&gt;タグを使用してMedia Streamを開始する</li>
                        <li>WebSocketサーバーが音声ストリームを受信・処理できることを確認する</li>
                        <li>リアルタイム音声がAssemblyAIに送信され、認識されます</li>
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
                  設定を確認するためのテスト通話を実行
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
                    国際形式で入力してください（例：+81 80 1234 5678）
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
          </TabsContent>
          
          <TabsContent value="assembly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  <span>AssemblyAI設定</span>
                </CardTitle>
                <CardDescription>
                  リアルタイム音声認識サービスの設定
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assembly-api-key">AssemblyAI API Key</Label>
                  <Input
                    id="assembly-api-key"
                    type="password"
                    value={assemblyApiKey}
                    onChange={(e) => setAssemblyApiKey(e.target.value)}
                    placeholder="AssemblyAI APIキーを入力"
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <div className="flex gap-2">
                    <Radio className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">AssemblyAIリアルタイム認識エンドポイント</p>
                      <p className="mt-1">
                        <code className="bg-blue-100 px-1">wss://api.assemblyai.com/v2/realtime/ws?sample_rate=8000</code>
                      </p>
                      <p className="mt-2">
                        AssemblyAIはTwilioの音声ストリームをリアルタイムで処理し、文字起こし結果を返します。システムは自動的にこれらの結果をAIに送信して回答を生成します。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-800 mt-4">
                  <div className="flex gap-2">
                    <InfoIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">連携フロー説明</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Twilio通話音声 → WebSocketサーバー</li>
                        <li>WebSocketサーバー → AssemblyAIリアルタイム認識</li>
                        <li>認識結果 → AI回答生成</li>
                        <li>AI回答 → TTS音声合成</li>
                        <li>音声応答 → Twilioを通してユーザーに再生</li>
                      </ol>
                      <p className="mt-2 text-xs">
                        注：このフローではサーバーサイドでWebSocketサービスと音声処理機能のデプロイが必要です
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">キャンセル</Button>
                <Button onClick={handleSaveAssemblyConfig}>AssemblyAI設定を保存</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <span>サーバー設定</span>
                </CardTitle>
                <CardDescription>
                  WebSocketサーバーのサンプルコード
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-slate-50 rounded-md p-4 text-sm font-mono overflow-x-auto">
                  <pre>{`import websockets
import asyncio
import base64
import json

ASSEMBLYAI_ENDPOINT = "wss://api.assemblyai.com/v2/realtime/ws?sample_rate=8000"
API_KEY = "${assemblyApiKey || '<YOUR_ASSEMBLYAI_API_KEY>'}"

async def handler(websocket, path):
    async with websockets.connect(ASSEMBLYAI_ENDPOINT, 
               extra_headers={"Authorization": API_KEY}) as aai_ws:

        async def forward_audio():
            async for message in websocket:
                msg = json.loads(message)
                if msg.get("event") == "media":
                    audio = base64.b64decode(msg["media"]["payload"])
                    await aai_ws.send(audio)

        async def receive_transcripts():
            async for msg in aai_ws:
                data = json.loads(msg)
                if data.get("text"):
                    print("User said:", data["text"])
                    # Call AI for response
                    await handle_user_message(data["text"])

        await asyncio.gather(forward_audio(), receive_transcripts())

start_server = websockets.serve(handler, "0.0.0.0", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()`}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* シミュレーターカードを追加 */}
        <div className="mt-6">
          <TwilioSimulator />
        </div>
      </main>
    </div>
  );
};

export default TwilioSetup;

