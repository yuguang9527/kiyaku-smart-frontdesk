
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Send, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface CommentFormData {
  comment: string;
}

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  onMarkComplete: () => void;
  isCompleted: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onMarkComplete,
  isCompleted
}) => {
  const { language } = useLanguage();
  
  const form = useForm<CommentFormData>({
    defaultValues: {
      comment: ''
    }
  });

  const handleSubmit = (data: CommentFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                {language === 'ja' ? 'ホテルスタッフコメント' : 'Hotel Staff Comment'}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={language === 'ja' ? 'コメントを入力してください...' : 'Enter your comment...'}
                  className="min-h-[60px] resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline"
            size="sm" 
            className="flex items-center gap-2"
            onClick={onMarkComplete}
          >
            <Check className="h-4 w-4" />
            {isCompleted 
              ? (language === 'ja' ? '対応中に戻す' : 'Mark In Progress')
              : (language === 'ja' ? '完了' : 'Complete')
            }
          </Button>
          <Button type="submit" size="sm" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {language === 'ja' ? 'コメント追加' : 'Add Comment'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
