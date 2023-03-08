import { FC } from 'react';
import Stack from '@mui/material/Stack';
import { FilledButton } from 'components/common/buttons';
import OfferAndBidItem from 'components/modules/feed-elements/OfferAndBidItem';
import CircularProgressIndicator from 'components/common/progress-indicator';
import { Box } from '@mui/material';
import ImageBase from 'components/common/ImageBase';

interface IOfferRecords {
  items: any[];
  hasMore: boolean;
  totalPages: number;
  nextPage: number;
}

interface IAssetOfferingListProps {
  records: IOfferRecords;
  loading: boolean;
  cancelOfferLoadingId: number;
  assetDataDetail: any;
  onCancel: (id: number) => void;
  onAccept: (id: number) => void;
  onLoadMore: () => void;
  isERC1155?: boolean;
}

const AssetOfferingList: FC<IAssetOfferingListProps> = (props) => {
  const {
    loading,
    records,
    assetDataDetail,
    onCancel,
    onAccept,
    onLoadMore,
    cancelOfferLoadingId,
    isERC1155 = false,
  } = props;
  const isEmptyOffers = !records.items.length;

  const renderContent = () => {
    if (isEmptyOffers && loading)
      return <CircularProgressIndicator size={50} className="flex justify-center pt-[50px]" />;
    if (isEmptyOffers)
      return (
        <Box className="no-data">
          <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
          <label>No results</label>
        </Box>
      );

    return (
      <Stack spacing={2} alignItems={'center'} className="max-h-96">
        {records.items.map((offer: any) => {
          return (
            <OfferAndBidItem
              isERC1155={isERC1155}
              key={offer?.id}
              cancelOfferLoadingId={cancelOfferLoadingId}
              offer={offer}
              assetDataDetail={assetDataDetail}
              cancel={() => onCancel(offer.id)}
              accept={() => onAccept(offer.id)}
            />
          );
        })}
        {records.hasMore && (
          <FilledButton loading={loading} text="Load more" onClick={onLoadMore} />
        )}
      </Stack>
    );
  };

  return (
    <div className="max-w-[458px] lg:max-w-[100%]  mx-auto lg:h-[430px] relative">
      {renderContent()}
    </div>
  );
};

export default AssetOfferingList;
