// Reusable gray shimmer placeholders shown while fake data is loading.
const ShimmerBox = ({ width = "100%", height = 12 }) => (
    <div className="shimmer rounded-md" style={{ width, height }} />
);

const JobCardShimmer = () => (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
            <ShimmerBox width={48} height={48} />
            <div className="flex-1 space-y-2">
                <ShimmerBox width="55%" height={16} />
                <ShimmerBox width="35%" height={12} />
            </div>
        </div>
        <div className="mt-4 space-y-2">
            <ShimmerBox width="90%" height={12} />
            <ShimmerBox width="70%" height={12} />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
            <ShimmerBox width="30%" height={12} />
            <ShimmerBox width={90} height={32} />
        </div>
    </div>
);

const TableRowShimmer = ({ columns = 4 }) => {
    const cells = [];

    for (let index = 0; index < columns; index++) {
        cells.push(
            <td key={index} className="px-5 py-3">
                <ShimmerBox width={index === 0 ? "70%" : "50%"} height={12} />
            </td>
        );
    }

    return <tr>{cells}</tr>;
};

export { ShimmerBox, JobCardShimmer, TableRowShimmer };
