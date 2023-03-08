import {
  currentTimeInPopup,
  MAX_PRICE,
  METHOD_SELL_AUCTION,
  NFT_FILE_SIZE,
  SELL_TYPE,
} from 'constants/app';
import Web3 from 'web3';
import * as Yup from 'yup';

export const validationSchemaAssetDetail = {
  title: Yup.string().trim().required('Title is not allowed to be empty.'),
  description: Yup.string().trim(),
  externalLink: Yup.string()
    .trim()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Invalid URL',
    ),
  nftImagePreview: Yup.mixed()
    .nullable()
    .test('fileSize', 'The uploaded file is too large. The max file is 100 mb', (file: any) => {
      if (!file) return true;
      return file.size <= NFT_FILE_SIZE;
    })
    .required('NFT Content is not allowed to be empty.'),
  nftVideo: Yup.mixed().test(
    'fileSize',
    'The uploaded file is too large. The max file is 100 mb',
    (file: any) => {
      if (!file) return true;
      return file.size <= NFT_FILE_SIZE;
    },
  ),
  nftAudio: Yup.mixed().test(
    'fileSize',
    'The uploaded file is too large. The max file is 100 mb',
    (file) => {
      return !file || (file && file.size <= NFT_FILE_SIZE);
    },
  ),
  tokenId: Yup.string(),
  collectionAddress: Yup.string().required('Collection is not allowed to be empty.'),
  categoryIds: Yup.array().min(1, 'Categories of NFT are not allowed to be empty.'),
  supply: Yup.number()
    .max(100000, 'The supply cannot exceed 100,000')
    .required('Supply is not allowed to be empty.'),
};

export const validationSchemaAdvancedDetails = {
  isUnlockableContent: Yup.boolean(),
  isExplicitSensitiveContent: Yup.boolean(),
  unlockableContent: Yup.string()
    .trim()
    .when('isUnlockableContent', {
      is: true,
      then: Yup.string().required('Unlockable Content is not allowed to be empty.'),
    }),
  properties: Yup.array().of(
    Yup.object().shape(
      {
        name: Yup.string()
          .trim()
          .nullable()
          .when(['value'], {
            is: (value: string) => {
              console.log('value', !!value);
              return !!value;
            },
            then: Yup.string().required('Name is not allowed to be empty'),
          }),
        value: Yup.string()
          .trim()
          .nullable()
          .when(['name'], {
            is: (name: string) => {
              console.log('name', !!name);
              return !!name;
            },
            then: Yup.string().required('Type is not allowed to be empty'),
          }),
      },
      ['name', 'value'],
    ),
  ),
  // levels: Yup.array().of(
  //   Yup.object().shape({
  //     name: Yup.string().required('Name is not allowed to be empty'),
  //     // level: Yup.number().required('Type is not allowed to be empty'),
  //     // maxLevel: Yup.number().required('Type is not allowed to be empty'),
  //   }),
  // ),
  // stats: Yup.array().of(
  //   Yup.object().shape({
  //     name: Yup.string().required('Name is not allowed to be empty'),
  //     // level: Yup.number().required('Type is not allowed to be empty'),
  //     // maxLevel: Yup.number().required('Type is not allowed to be empty'),
  //   }),
  // ),
};

export const validationSchemaPriceDetails = {
  reserveBuyer: Yup.string()
    .trim()
    .when(['listYourAsset', 'sellMethod', 'isShowReserveBuyer'], {
      is: (listYourAsset: boolean, sellMethod: string, isShowReserveBuyer: boolean) =>
        listYourAsset && sellMethod === SELL_TYPE.FIX_PRICE && isShowReserveBuyer,
      then: Yup.string()
        .test('reserveBuyer', 'Invalid address', (value: any) => {
          if (!value) return true;
          return Web3.utils.isAddress(value);
        })
        .required('Address is not allowed to be empty'),
    }),
  //fixed price
  amount: Yup.number().when(['listYourAsset', 'sellMethod'], {
    is: (listYourAsset: boolean, sellMethod: string) =>
      listYourAsset && sellMethod === SELL_TYPE.FIX_PRICE,
    then: Yup.number().test({
      name: 'amount',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (value <= 0) {
          return createError({
            message: `Price must be greater than 0`,
            path: 'amount', // Fieldname
          });
        }
        if (!value) {
          return createError({
            message: `Price/Price per unit is not allowed to be empty`,
            path: 'amount', // Fieldname
          });
        }
        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed 10,000,000,000`,
            path: 'amount', // Fieldname
          });
        }
        const floorPrice =
          this?.parent?.currency === 'UMAD'
            ? this?.parent?.UMadFloorPrice
            : this?.parent?.ethFloorPrice;
        if (value < floorPrice) {
          return createError({
            message: `Price is below collection floor price of ${this?.parent?.UMadFloorPrice} UMAD | ${this?.parent?.ethFloorPrice} ETH`,
            path: 'amount', // Fieldname
          });
        }
        return true;
      },
    }),
  }),
  duration: Yup.mixed().when(['listYourAsset', 'sellMethod', 'methodType'], {
    is: (listYourAsset: boolean, sellMethod: string, methodType: string) =>
      listYourAsset && sellMethod === SELL_TYPE.FIX_PRICE,
    then: Yup.mixed().test({
      name: 'duration',
      exclusive: false,
      params: {},
      test: function (value: any, { createError, parent }: any) {
        if (value?.type !== 'Custom date') return true;
        if ((value.endDate as number) < (value.startDate as number)) {
          return createError({
            message: `End time cannot be before start time`,
            path: 'duration',
          });
        }
        if (
          value?.type === 'Custom date' &&
          (Number(value.startDate) < currentTimeInPopup ||
            Number(value.endDate) < currentTimeInPopup)
        ) {
          return createError({
            message: `Duration time cannot be the past`,
            path: 'duration',
          });
        }
        return true;
      },
    }),
  }),
  // english auction
  startingPriceEngAuction: Yup.number().when(['listYourAsset', 'sellMethod', 'methodType'], {
    is: (listYourAsset: boolean, sellMethod: string, methodType: string) =>
      listYourAsset &&
      sellMethod === SELL_TYPE.AUCTION &&
      methodType === METHOD_SELL_AUCTION.SELL_TO_HIGHTEST_BIDDER,
    then: Yup.number().test({
      name: 'startingPriceEngAuction',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (value <= 0) {
          return createError({
            message: `Price must be greater than 0`,
            path: 'startingPriceEngAuction', // Fieldname
          });
        }
        if (!value) {
          return createError({
            message: `Starting price is not allowed to be empty`,
            path: 'startingPriceEngAuction', // Fieldname
          });
        }

        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed 10,000,000,000`,
            path: 'startingPriceEngAuction', // Fieldname
          });
        }

        const floorPrice =
          this?.parent?.startingEngAuctionCurrency === 'UMAD'
            ? this?.parent?.UMadFloorPrice
            : this?.parent?.ethFloorPrice;
        if (value < floorPrice) {
          return createError({
            message: `Price is below collection floor price of ${this?.parent?.UMadFloorPrice} UMAD | ${this?.parent?.ethFloorPrice} ETH`,
            path: 'startingPriceEngAuction', // Fieldname
          });
        }
        return true;
      },
    }),
  }),
  durationEngAuction: Yup.mixed().when(['sellMethod', 'methodType'], {
    is: (sellMethod: string, methodType: string) =>
      sellMethod === SELL_TYPE.AUCTION &&
      methodType === METHOD_SELL_AUCTION.SELL_TO_HIGHTEST_BIDDER,
    then: Yup.mixed().test({
      name: 'durationEngAuction',
      exclusive: false,
      params: {},
      test: function (value: any, { createError, parent }: any) {
        if (value?.type !== 'Custom date') return true;
        if ((value.endDate as number) < (value.startDate as number)) {
          return createError({
            message: `End time cannot be before start time`,
            path: 'durationEngAuction',
          });
        }
        if (
          Number(value.startDate) < currentTimeInPopup ||
          Number(value.endDate) < currentTimeInPopup
        ) {
          return createError({
            message: `Duration time cannot be the past`,
            path: 'durationEngAuction',
          });
        }
        return true;
      },
    }),
  }),
  // dutch auction
  staringPrice: Yup.number().when(['listYourAsset', 'sellMethod', 'methodType'], {
    is: (listYourAsset: boolean, sellMethod: string, methodType: string) =>
      listYourAsset &&
      sellMethod === SELL_TYPE.AUCTION &&
      methodType === METHOD_SELL_AUCTION.SELL_WITH_DECLINING_PRICE,
    then: Yup.number().test({
      name: 'staringPrice',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (value <= 0) {
          return createError({
            message: `Price must be greater than 0`,
            path: 'staringPrice', // Fieldname
          });
        }
        if (!value) {
          return createError({
            message: `Starting price is not allowed to be empty`,
            path: 'staringPrice', // Fieldname
          });
        }

        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed 10,000,000,000`,
            path: 'staringPrice', // Fieldname
          });
        }

        const floorPrice =
          this?.parent?.staringCurrency === 'UMAD'
            ? this?.parent?.UMadFloorPrice
            : this?.parent?.ethFloorPrice;
        if (value < floorPrice) {
          return createError({
            message: `Price is below collection floor price of ${this?.parent?.UMadFloorPrice} UMAD | ${this?.parent?.ethFloorPrice} ETH`,
            path: 'staringPrice', // Fieldname
          });
        }
        return true;
      },
    }),
  }),
  endingPrice: Yup.number().when(['listYourAsset', 'sellMethod', 'methodType'], {
    is: (listYourAsset: boolean, sellMethod: string, methodType: string) =>
      listYourAsset &&
      sellMethod === SELL_TYPE.AUCTION &&
      methodType === METHOD_SELL_AUCTION.SELL_WITH_DECLINING_PRICE,
    then: Yup.number().test({
      name: 'endingPrice',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (value <= 0) {
          return createError({
            message: `Price must be greater than 0`,
            path: 'endingPrice', // Fieldname
          });
        }
        if (!value) {
          return createError({
            message: `Ending price is not allowed to be empty`,
            path: 'endingPrice', // Fieldname
          });
        }

        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed 10,000,000,000`,
            path: 'endingPrice', // Fieldname
          });
        }

        if (value >= this?.parent?.staringPrice) {
          return createError({
            message: `Ending price must be less than starting price`,
            path: 'endingPrice', // Fieldname
          });
        }

        const floorPrice =
          this?.parent?.staringCurrency === 'UMAD'
            ? this?.parent?.UMadFloorPrice
            : this?.parent?.ethFloorPrice;
        if (value < floorPrice) {
          return createError({
            message: `Price is below collection floor price of ${this?.parent?.UMadFloorPrice} UMAD | ${this?.parent?.ethFloorPrice} ETH`,
            path: 'endingPrice', // Fieldname
          });
        }
        return true;
      },
    }),
  }),
  durationDutchAuction: Yup.mixed().when(['sellMethod', 'methodType'], {
    is: (sellMethod: string, methodType: string) =>
      sellMethod === SELL_TYPE.AUCTION &&
      methodType === METHOD_SELL_AUCTION.SELL_WITH_DECLINING_PRICE,
    then: Yup.mixed().test({
      name: 'durationDutchAuction',
      exclusive: false,
      params: {},
      test: function (value: any, { createError, parent }: any) {
        if (!value) return true;
        if (value?.type !== 'Custom date') return true;
        if ((value.endDate as number) < (value.startDate as number)) {
          return createError({
            message: `End time cannot be before start time`,
            path: 'durationDutchAuction',
          });
        }
        if (
          Number(value.startDate) < currentTimeInPopup ||
          Number(value.endDate) < currentTimeInPopup
        ) {
          return createError({
            message: `Duration time cannot be the past`,
            path: 'durationDutchAuction',
          });
        }
        return true;
      },
    }),
  }),
  reservePrice: Yup.mixed().when(['isShowReversePrice', 'sellMethod', 'methodType'], {
    is: (isShowReversePrice: boolean, sellMethod: string, methodType: string) =>
      isShowReversePrice &&
      sellMethod === SELL_TYPE.AUCTION &&
      methodType === METHOD_SELL_AUCTION.SELL_TO_HIGHTEST_BIDDER,
    then: Yup.number().test({
      name: 'reservePrice',
      exclusive: false,
      params: {},
      test: function (value: any, { createError, parent }: any) {
        if (!value) {
          return createError({
            message: `Include reserve price is not allowed to be empty`,
            path: 'reservePrice',
          });
        }
        if (value <= parent.startingPriceEngAuction) {
          return createError({
            message: `Reserve price must be greater than starting price`,
            path: 'reservePrice',
          });
        }

        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed 10,000,000,000`,
            path: 'reservePrice', // Fieldname
          });
        }

        if (
          (parent.startingEngAuctionCurrency === 'UMAD' && value < 5000) ||
          (parent.startingEngAuctionCurrency === 'WETH' && value < 1)
        ) {
          return createError({
            message: `The reserve price must be greater than or equal to 1 WETH / 5000 UMAD`,
            path: 'reservePrice',
          });
        }
        return true;
      },
    }),
  }),
};

// erc1155
export const validationSchemaErc1155 = {
  quantity: Yup.number().when(['listYourAsset'], {
    is: true,
    then: Yup.number()
      .test({
        name: 'quantity',
        exclusive: false,
        params: {},
        test: function (value: any, { createError, parent }: any) {
          if (!value) return true;
          if (value > parent.supply) {
            return createError({
              message: `The quantity cannot exceed ${parent.supply}`,
              path: 'quantity', // Fieldname
            });
          }
          return true;
        },
      })
      .required('Quantity is not allowed to be empty.'),
  }),
};
