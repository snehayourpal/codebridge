import { AppTemplate } from '@/lib/types';

export default function TemplateSelector({
  templates,
  onSelect
}: {
  templates: AppTemplate[];
  onSelect: (template: AppTemplate) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map(template => (
        <div
          key={template.id}
          onClick={() => onSelect(template)}
          className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow bg-[#010079]"
        >
          <h3 className="text-xl text-white font-bold">{template.name}</h3>
          <p className=" mt-2">{template.description}</p>
          <div className="mt-4 text-sm text-[#1B73D3]">Use Template</div>
        </div>
      ))}
    </div>
  );
}