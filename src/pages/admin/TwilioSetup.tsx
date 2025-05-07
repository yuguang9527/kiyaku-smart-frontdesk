
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
  const [accountSid, setAccountSid] = useState('AC81e62b3089fa4a6d77985129b3036000');
  const [authToken, setAuthToken] = useState('47004d9657e812409aa2890c540ad521');
  const [phoneNumber, setPhoneNumber] = useState('+14788001081'); // 更新为新的Twilio号码
  const [testNumber, setTestNumber] = useState('');
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

  return (
    <div className="flex min-h-screen flex-col washi-bg">
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-display text-primary">Twilio 电话集成设置</h1>
          <p className="text-muted-foreground mt-1">
            配置AI电话应答系统
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
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

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800 mt-4">
                <div className="flex gap-2">
                  <InfoIcon className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">重要提示：Twilio配置方法</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>创建Twilio账户并购买电话号码</li>
                      <li>在电话号码设置中配置Webhook URL</li>
                      <li>在Voice设置中选择HTTP POST</li>
                      <li>将Webhook URL设置为 <code className="bg-amber-100 px-1">/api/twilio/voice</code></li>
                      <li>同样配置状态回调URL</li>
                      <li>系统现已支持中文和英文双语应答</li>
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

          {/* 添加模拟器卡片 */}
          <TwilioSimulator />
        </div>
      </main>
    </div>
  );
};

export default TwilioSetup;
