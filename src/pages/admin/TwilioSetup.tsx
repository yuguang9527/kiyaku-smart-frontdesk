
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

const TwilioSetup: React.FC = () => {
  const [accountSid, setAccountSid] = useState('AC81e62b3089fa4a6d77985129b3036000');
  const [authToken, setAuthToken] = useState('47004d9657e812409aa2890c540ad521');
  const [phoneNumber, setPhoneNumber] = useState('+14788001081');
  const [testNumber, setTestNumber] = useState('');
  const [assemblyApiKey, setAssemblyApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('wss://yourdomain.com:8765');
  const { toast } = useToast();

  // Twilio的配置保存
  const handleSaveConfig = () => {
    // 实际应用中，这里应该将配置保存到后端
    // 此示例仅使用本地状态
    
    toast({
      title: "Twilio设置已保存",
      description: "设置已成功保存。电话集成现已启用。",
    });
  };

  // 执行测试通话
  const handleTestCall = () => {
    if (!testNumber) {
      toast({
        title: "需要电话号码",
        description: "请输入有效的电话号码进行测试通话",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "开始测试通话",
      description: `正在拨打${testNumber}...需要实际的Twilio账户`,
    });
    
    // 实际的Twilio设置时，这里将调用API进行拨号
  };

  // AssemblyAI的配置保存
  const handleSaveAssemblyConfig = () => {
    if (!assemblyApiKey) {
      toast({
        title: "需要API密钥",
        description: "请输入有效的AssemblyAI API密钥",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "AssemblyAI设置已保存",
      description: "实时语音识别配置已成功保存。",
    });
  };

  return (
    <div className="flex min-h-screen flex-col washi-bg">
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-display text-primary">Twilio & AssemblyAI 音声集成设置</h1>
          <p className="text-muted-foreground mt-1">
            配置AI电话应答系统与实时语音识别
          </p>
        </div>

        <Tabs defaultValue="twilio">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="twilio">Twilio 配置</TabsTrigger>
            <TabsTrigger value="assembly">AssemblyAI 实时语音识别</TabsTrigger>
          </TabsList>
          
          <TabsContent value="twilio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <span>Twilio账户设置</span>
                </CardTitle>
                <CardDescription>
                  请输入Twilio账户信息
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
                  <Label htmlFor="phone-number">Twilio电话号码</Label>
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
                    用于接收实时音频流的WebSocket服务器URL
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800 mt-4">
                  <div className="flex gap-2">
                    <InfoIcon className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">重要提示：Twilio Media Streams配置方法</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>创建Twilio账户并购买电话号码</li>
                        <li>配置TwiML应用使用&lt;Stream&gt;标签</li>
                        <li>添加WebSocket URL: <code className="bg-amber-100 px-1">{webhookUrl}</code></li>
                        <li>使用&lt;Start&gt;&lt;Stream&gt;标签开始Media Stream</li>
                        <li>确保您的WebSocket服务器可以接收并处理音频流</li>
                        <li>实时音频将被发送到AssemblyAI进行识别</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">取消</Button>
                <Button onClick={handleSaveConfig}>保存设置</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  <span>测试通话</span>
                </CardTitle>
                <CardDescription>
                  进行测试通话来验证设置
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-number">测试用电话号码</Label>
                  <Input
                    id="test-number"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    placeholder="+818012345678"
                  />
                  <p className="text-sm text-muted-foreground">
                    请使用国际格式（例如: +81 80 1234 5678）
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
                  <span>执行测试通话</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="assembly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  <span>AssemblyAI配置</span>
                </CardTitle>
                <CardDescription>
                  配置实时语音识别服务
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
                    placeholder="输入您的AssemblyAI API密钥"
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <div className="flex gap-2">
                    <Radio className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">AssemblyAI实时识别端点</p>
                      <p className="mt-1">
                        <code className="bg-blue-100 px-1">wss://api.assemblyai.com/v2/realtime/ws?sample_rate=8000</code>
                      </p>
                      <p className="mt-2">
                        AssemblyAI会实时处理Twilio的音频流并返回转录结果。系统将自动将这些结果发送给AI进行回答生成。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-800 mt-4">
                  <div className="flex gap-2">
                    <InfoIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">集成流程说明</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Twilio通话音频 → WebSocket服务器</li>
                        <li>WebSocket服务器 → AssemblyAI实时识别</li>
                        <li>识别结果 → AI生成响应</li>
                        <li>AI响应 → TTS语音合成</li>
                        <li>语音回复 → 通过Twilio播放给用户</li>
                      </ol>
                      <p className="mt-2 text-xs">
                        注：此流程需要服务器端部署WebSocket服务和音频处理功能
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">取消</Button>
                <Button onClick={handleSaveAssemblyConfig}>保存AssemblyAI设置</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <span>服务器设置</span>
                </CardTitle>
                <CardDescription>
                  WebSocket服务器示例代码
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

        {/* 添加模拟器卡片 */}
        <div className="mt-6">
          <TwilioSimulator />
        </div>
      </main>
    </div>
  );
};

export default TwilioSetup;
