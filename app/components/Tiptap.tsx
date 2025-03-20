import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapProps {
  data: string;
  onEdit: (data: string) => void;
}

export const Tiptap: React.FC<TiptapProps> = ({ data, onEdit }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: data,
    onUpdate: ({ editor }) => {
      const desc = editor.getHTML();
      onEdit(desc);
    },
  });
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const handleBold = () => {
    editor?.chain().focus().toggleBold().run();
    setBold(!bold);
  };
  const handleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
    setItalic(!italic);
  };
  return (
    <div className="border-2 border-black">
      <div className="bg-[rgba(0,0,0,0.8)] border-b-2 border-black">
        <Button
          variant="outline"
          className={`bg-white border-2 border-black m-2 ${bold && "text-teal-500 bg-black"
            }`}
          onClick={handleBold}
        >
          Bold
        </Button>
        <Button
          variant="outline"
          className={`bg-white border-2 border-black m-2 ${italic && "text-teal-500 bg-black"
            }`}
          onClick={handleItalic}
        >
          Italic
        </Button>
      </div>
      <EditorContent editor={editor} className="p-2" />
    </div>
  )
}