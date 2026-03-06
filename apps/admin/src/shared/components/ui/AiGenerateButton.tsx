'use client';

import { useState } from 'react';
import { Check, LoaderIcon, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AiGenerateButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  isCompleted: boolean;
  disabled?: boolean;
  hasExistingValue?: boolean;
};

export function AiGenerateButton({
  onClick,
  isLoading,
  isCompleted,
  disabled = false,
  hasExistingValue = false,
}: AiGenerateButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClick = () => {
    if (hasExistingValue) {
      setIsConfirmOpen(true);
    } else {
      onClick();
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isCompleted || isLoading || disabled}
        className="shrink-0"
      >
        {isLoading ? (
          <LoaderIcon className="size-3.5 animate-spin" />
        ) : isCompleted ? (
          <Check className="size-3.5" />
        ) : (
          <Sparkles className="size-3.5" />
        )}
        {isCompleted ? '생성 완료' : 'AI 생성'}
      </Button>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>기존 내용을 덮어쓸까요?</AlertDialogTitle>
            <AlertDialogDescription>
              이미 입력된 내용이 있습니다. AI가 생성한 내용으로 교체됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsConfirmOpen(false);
                onClick();
              }}
            >
              덮어쓰기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
