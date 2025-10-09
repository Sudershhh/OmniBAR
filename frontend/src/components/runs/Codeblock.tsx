import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CodeBlockProps {
  title: string;
  content: string;
}

export function CodeBlock({ title, content }: CodeBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code className="font-mono">{content}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
