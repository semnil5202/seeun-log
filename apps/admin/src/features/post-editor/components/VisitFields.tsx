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
      <div>
        <label className="mb-1 block text-base font-bold">가격</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={pricePrefix}
            onChange={(e) => onPricePrefixChange(e.target.value)}
            placeholder="메인메뉴 평균: "
            className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="금액 (원)"
            className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
}
