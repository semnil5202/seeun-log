'use client';

import { createContext, useContext, type KeyboardEvent, type ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SearchFilterContext = createContext<{ onSearch: () => void }>({ onSearch: () => {} });

type DateRangeProps = {
  registerFrom: UseFormRegisterReturn;
  registerTo: UseFormRegisterReturn;
  children?: ReactNode;
};

function DateRange({ registerFrom, registerTo, children }: DateRangeProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 max-md:flex-col max-md:items-start">
      <span className="w-12 shrink-0 text-sm font-bold text-primary-600">기간</span>
      <div className="flex flex-wrap items-center gap-2">
        <Input type="date" {...registerFrom} className="w-[150px]" />
        <span className="text-muted-foreground">&rarr;</span>
        <Input type="date" {...registerTo} className="w-[150px]" />
      </div>
      {children && <div className="ml-auto flex items-center gap-2 max-md:ml-0">{children}</div>}
    </div>
  );
}

type QueryProps = {
  register: UseFormRegisterReturn;
  placeholder?: string;
};

function Query({ register, placeholder = '검색어 입력' }: QueryProps) {
  const { onSearch } = useContext(SearchFilterContext);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="flex items-center gap-3 max-md:flex-col max-md:items-start">
      <span className="w-12 shrink-0 text-sm font-bold text-primary-600">검색어</span>
      <div className="flex flex-1 items-center gap-3">
        <Input
          type="text"
          placeholder={placeholder}
          {...register}
          onKeyDown={handleKeyDown}
          className="w-full max-w-[330px]"
        />
        <Button variant="outline" onClick={onSearch}>
          <Search className="mr-1 h-4 w-4" />
          검색
        </Button>
      </div>
    </div>
  );
}

type SearchFilterProps = {
  onSearch: () => void;
  children: ReactNode;
};

function SearchFilter({ onSearch, children }: SearchFilterProps) {
  return (
    <SearchFilterContext value={{ onSearch }}>
      <div className="space-y-3 rounded-lg border bg-card p-4">{children}</div>
    </SearchFilterContext>
  );
}

SearchFilter.DateRange = DateRange;
SearchFilter.Query = Query;

export default SearchFilter;
