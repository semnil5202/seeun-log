/** 체험 방문 전용 필드 — 장소, 주소, 가격. */

type VisitFieldsProps = {
  placeName: string;
  address: string;
  pricePrefix: string;
  price: string;
  onPlaceNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPricePrefixChange: (value: string) => void;
  onPriceChange: (value: string) => void;
};

export function VisitFields({
  placeName,
  address,
  pricePrefix,
  price,
  onPlaceNameChange,
  onAddressChange,
  onPricePrefixChange,
  onPriceChange,
}: VisitFieldsProps) {
  return (
    <div className="mt-8 space-y-4">
      <div>
        <label className="mb-1 block text-base font-bold">
          장소 <span className="text-primary-600">*</span>
        </label>
        <input
          type="text"
          value={placeName}
          onChange={(e) => onPlaceNameChange(e.target.value)}
          placeholder="장소를 입력해주세요."
          className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div>
        <label className="mb-1 block text-base font-bold">
          주소 <span className="text-primary-600">*</span>
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="주소를 입력해주세요."
          className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex gap-2">
        <div className="grow-[2] basis-0">
          <label className="mb-1 block text-base font-bold">
            가격 설명 <span className="text-muted-foreground">(선택)</span>
          </label>
          <input
            type="text"
            value={pricePrefix}
            onChange={(e) => onPricePrefixChange(e.target.value)}
            placeholder="ex: 메인 메뉴 평균 가격: "
            className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="grow basis-0">
          <div className="mb-1 flex items-baseline gap-1.5">
            <label className="text-base font-bold">
              금액 <span className="text-muted-foreground">(필수값)</span>
            </label>
            <span className="text-[14px] text-muted-foreground">(단위: 만원)</span>
          </div>
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="금액"
            className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
}
