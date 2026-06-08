export function getStatusConfig(
  status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
) {
  switch (status) {
    case 'DRAFT':
      return {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700',
      };

    case 'PENDING':
      return {
        label: 'Queued',
        color: 'bg-yellow-100 text-yellow-700',
      };

    case 'PROCESSING':
      return {
        label: 'Generating',
        color: 'bg-blue-100 text-blue-700',
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-700',
      };

    case 'FAILED':
      return {
        label: 'Failed',
        color: 'bg-red-100 text-red-700',
      };

    default:
      return {
        label: 'Unknown',
        color: 'bg-gray-100 text-gray-500',
      };
  }
}
