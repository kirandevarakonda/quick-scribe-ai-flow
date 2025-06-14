import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface ContentCreationProps {
  data: {
    content: string;
    selectedTopic: string;
  };
  onBack?: () => void;
}

export default function ContentCreation({ data, onBack }: ContentCreationProps) {
  const handleCopyContent = () => {
    navigator.clipboard.writeText(data.content);
    toast.success('Content copied to clipboard!');
  };

  const handleDownloadContent = () => {
    const blob = new Blob([data.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.selectedTopic.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generated content for: {data.selectedTopic}</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyContent}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
          <Button variant="outline" onClick={handleDownloadContent}>
            <Download className="mr-2 h-4 w-4" />
            Download as Text
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="whitespace-pre-wrap">{data.content}</p>
        </CardContent>
      </Card>

      {onBack && (
        <div className="flex justify-start">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Topics
          </Button>
        </div>
      )}
    </div>
  );
} 