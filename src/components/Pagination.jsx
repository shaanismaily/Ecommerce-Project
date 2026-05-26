function Pagination({page, totalPages, onPageChange}) {
    return (
        <nav 
        aria-label="Page-navigation"
        className="flex justify-center items-center flex-wrap gap-6 pt-1 pb-2">
            <button
            onClick={() => onPageChange(page-1)}
            disabled={page === 1}
            aria-label="Previous page"
            className="border border-r-4 border-[#E2DED8] rounded-sm cursor-pointer py-2 px-3.5 text-[#1A1714] transition-all hover:not-disabled:bg-[#EBF0FD]
            hover:not-disabled:border-[#2D5BE3]
            hover:not-disabled:text-[#2D5BE3]
            disabled:opacity-35
            disabled:cursor-not-allowed"
            >
                ← Prev
            </button>

            <div className="flex gap-2">
                {
                    Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => 
                            p === 1 ||
                            p === totalPages ||
                            (p >= page - 1 && p <= page + 1)
                        )
                        .reduce((acc, p, idx, arr) => {
                            if (idx > 0 && p - arr[idx - 1] > 1) {
                                acc.push("...")
                            }
                            acc.push(p)
                            return acc;
                        }, [])
                        .map((item, idx) => 
                            item === "..." ? (
                                <span key={`ellipsis-${idx}`}
                                className="px-1 text-[0.9rem] text-[#9C9690] leading-none"
                                >...</span>
                            ) : (
                                <button
                                key={item}
                                onClick={() => onPageChange(item)}
                                aria-current={item === page ? 'page' : undefined}
                                className={item === page ? "font-[600px] text-white border-[#2DFBE3] bg-[#2DFBE3] px-1 rounded-sm" : " border px-1 rounded-sm"}
                                >
                                    {item}
                                </button>
                            )
                        )
                }
            </div>

            <button
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="border border-[#E2DED8] rounded-sm cursor-pointer py-2 px-3.5 text-[#1A1714] transition-all hover:not-disabled:bg-[#EBF0FD]
            hover:not-disabled:border-[#2D5BE3]
            hover:not-disabled:text-[#2D5BE3]
            disabled:opacity-35
            disabled:cursor-not-allowed"
            >
                Next →
            </button>
        </nav>
    )
}
export default Pagination;