import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'tj', label: 'TJ' },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();

  const normalizedLanguage = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0];
  const currentLang = languages.find((l) => l.code === normalizedLanguage)?.code || 'uz';

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('lang', value);
  };

  return (
    <div className={className}>
      <Select value={currentLang} onValueChange={handleChange}>
        <SelectTrigger className="w-[60px] h-9 text-sm font-semibold uppercase">
          <SelectValue placeholder="Lang" />
        </SelectTrigger>

        <SelectContent align="end">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
