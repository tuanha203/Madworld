import React from 'react';
import { useSelector } from 'react-redux';

export const IconEthSVG = ({ style }: any) => {
  return (
    <figure className={`w-6 h-6`}>
      <svg width={22} height={31} fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
        <path
          d="M2.5 15.5 11 12l8.5 3.5L11 19l-8.5-3.5ZM11 2v17"
          stroke={style?.color || '#F4B1A3'}
        />
        <path d="M1 15.5 11 1l10 14.5L11 30 1 15.5Z" stroke={style?.color || '#F4B1A3'} />
      </svg>
    </figure>
  );
};

export const DiscordIconCustomSVG = ({ style }: any) => {
  const { icon } = useSelector((state: any) => state.theme);
  return (
    <a className="social-media-single-icon" target="_blank">
      <svg style={style} width={22} height={18} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.624 1.517A18.141 18.141 0 0 0 14.146.128a.068.068 0 0 0-.072.034c-.194.344-.408.793-.558 1.145a16.749 16.749 0 0 0-5.03 0A11.59 11.59 0 0 0 7.922.162a.07.07 0 0 0-.072-.034C6.277.398 4.774.873 3.37 1.517a.064.064 0 0 0-.03.025C.49 5.803-.292 9.96.091 14.064c.002.02.013.04.029.052a18.242 18.242 0 0 0 5.493 2.777.071.071 0 0 0 .077-.026c.423-.578.8-1.187 1.124-1.828a.07.07 0 0 0-.038-.096 12.013 12.013 0 0 1-1.716-.819.07.07 0 0 1-.007-.117 9.37 9.37 0 0 0 .34-.267.068.068 0 0 1 .072-.01c3.6 1.645 7.498 1.645 11.056 0a.068.068 0 0 1 .072.01c.11.09.226.181.342.268a.07.07 0 0 1-.006.117c-.548.32-1.118.59-1.717.817a.07.07 0 0 0-.038.097c.33.64.708 1.25 1.123 1.828a.07.07 0 0 0 .078.026 18.18 18.18 0 0 0 5.502-2.777.07.07 0 0 0 .028-.05c.459-4.746-.768-8.869-3.253-12.523a.055.055 0 0 0-.028-.026ZM7.352 11.565c-1.084 0-1.977-.995-1.977-2.217 0-1.223.875-2.218 1.977-2.218 1.11 0 1.994 1.004 1.977 2.218 0 1.222-.876 2.217-1.977 2.217Zm7.31 0c-1.084 0-1.977-.995-1.977-2.217 0-1.223.876-2.218 1.977-2.218 1.11 0 1.994 1.004 1.977 2.218 0 1.222-.867 2.217-1.977 2.217Z"
          fill={icon?.color || '#F4B1A3'}
        />
      </svg>
    </a>
  );
};

export const TwitterIconCustomSVG = (props: any) => {
  return (
    <a className="social-media-single-icon" target="_blank">
      <svg width={18} height={19} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M.75 14.33a9.615 9.615 0 0 0 5.166 1.497c5.336 0 9.662-4.327 9.662-9.662 0-.134-.002-.266-.008-.397.193-.152 1.387-1.11 1.68-1.724 0 0-.97.403-1.918.497h-.006l.005-.003c.087-.059 1.31-.892 1.475-1.883 0 0-.686.366-1.646.686-.16.053-.325.105-.497.153a3.39 3.39 0 0 0-5.778 3.083c-.261-.01-4.247-.235-6.959-3.518 0 0-1.62 2.213.966 4.487 0 0-.786-.031-1.464-.436 0 0-.25 2.68 2.68 3.366 0 0-.576.217-1.496.063 0 0 .514 2.165 3.117 2.367-.002.002-2.059 1.86-4.979 1.425Z"
          fill={props?.color || '#F4B1A3'}
        />
      </svg>
    </a>
  );
};

export const TelegramIconCustomSVG = (props: any) => {
  return (
    <a className="social-media-single-icon" target="_blank">
      <svg width={18} height={19} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.25 9.17a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0ZM9.74 6.81 4.185 9.099c-.979.381-.406.739-.406.739s.834.286 1.55.5c.715.215 1.096-.023 1.096-.023L9.787 8.05c1.193-.811.906-.144.62.143-.62.62-1.645 1.597-2.503 2.384-.382.334-.191.62-.024.763.485.41 1.628 1.157 2.147 1.496.144.095.24.157.261.173.12.095.786.524 1.192.43.406-.096.454-.645.454-.645l.596-3.743.154-1.007c.13-.837.234-1.517.252-1.759.071-.81-.787-.477-.787-.477s-1.86.763-2.409 1.002Z"
          fill={props?.color || '#F4B1A3'}
        />
      </svg>
    </a>
  );
};

export const BidIconSVG = ({ style }: any) => {
  return (
    <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.759 18.759a1.888 1.888 0 0 1-1.386.574c-.54 0-1-.188-1.376-.565l-4.248-4.247c-.462-.462-.644-1.015-.546-1.66L7.757 9.417a11.514 11.514 0 0 1-3.008 1.75C2.963 10.243 1.602 8.883.666 7.083A11.336 11.336 0 0 1 3.227 3.22 11.497 11.497 0 0 1 7.101.667a9.465 9.465 0 0 1 4.083 4.083 11.52 11.52 0 0 1-1.768 3.008l3.445 3.445c.644-.097 1.197.085 1.66.547l4.247 4.247c.376.377.565.836.565 1.377 0 .54-.192 1.002-.574 1.385Z"
        fill={style?.color || '#F4B1A3'}
      />
    </svg>
  );
};

export const TransferIconSVG = ({ style }: any) => {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5712 7.67857L6.14258 1.25"
        stroke={style?.color || '#F4B1A3'}
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.14258 3.82143V1.25H8.71401"
        stroke={style?.color || '#F4B1A3'}
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1 8.96484L7.42857 15.3934"
        stroke={style?.color || '#F4B1A3'}
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.42885 12.8213V15.3927H4.85742"
        stroke={style?.color || '#F4B1A3'}
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const WalletSvg = (props: any) => (
  <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M2.667 3.852h12.562v10.445H2.667V3.852Z"
      stroke={props?.color || '#F4B1A3'}
      strokeWidth={2}
    />
    <path d="M1.696 7.05h8.644v4.05H1.696V7.05Z" fill={props?.color || '#F4B1A3'} />
    <circle cx={8.028} cy={9.075} r={1.138} fill={props?.color || '#F4B1A3'} />
  </svg>
);

export const ActivityTransferSvg = (props: any) => (
  <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M5.4 14.4c-.99 0-1.791.81-1.791 1.8S4.41 18 5.4 18c.99 0 1.8-.81 1.8-1.8s-.81-1.8-1.8-1.8ZM0 0v1.8h1.8l3.24 6.831-1.215 2.205a1.74 1.74 0 0 0-.225.864c0 .99.81 1.8 1.8 1.8h10.8v-1.8H5.778a.223.223 0 0 1-.225-.225l.027-.108.81-1.467h6.705c.675 0 1.269-.369 1.575-.927l3.222-5.841A.903.903 0 0 0 17.1 1.8H3.789L2.943 0H0Zm14.4 14.4c-.99 0-1.791.81-1.791 1.8S13.41 18 14.4 18c.99 0 1.8-.81 1.8-1.8s-.81-1.8-1.8-1.8Z"
      fill={props.color || '#F4B1A3'}
    />
  </svg>
);

export const ActivitySaleSvg = (props: any) => (
  <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M5.4 14.4c-.99 0-1.791.81-1.791 1.8S4.41 18 5.4 18c.99 0 1.8-.81 1.8-1.8s-.81-1.8-1.8-1.8ZM0 0v1.8h1.8l3.24 6.831-1.215 2.205a1.74 1.74 0 0 0-.225.864c0 .99.81 1.8 1.8 1.8h10.8v-1.8H5.778a.223.223 0 0 1-.225-.225l.027-.108.81-1.467h6.705c.675 0 1.269-.369 1.575-.927l3.222-5.841A.903.903 0 0 0 17.1 1.8H3.789L2.943 0H0Zm14.4 14.4c-.99 0-1.791.81-1.791 1.8S13.41 18 14.4 18c.99 0 1.8-.81 1.8-1.8s-.81-1.8-1.8-1.8Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const ActivityTagSvg = (props: any) => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m19.41 9.58-9-9C10.05.22 9.55 0 9 0H2C.9 0 0 .9 0 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42ZM3.5 5C2.67 5 2 4.33 2 3.5S2.67 2 3.5 2 5 2.67 5 3.5 4.33 5 3.5 5Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const ActivityBidSvg = (props: any) => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M18.759 18.759a1.888 1.888 0 0 1-1.386.574c-.54 0-1-.188-1.376-.565l-4.248-4.247c-.462-.462-.644-1.015-.546-1.66L7.757 9.417a11.514 11.514 0 0 1-3.008 1.75C2.963 10.243 1.602 8.883.666 7.083A11.336 11.336 0 0 1 3.227 3.22 11.497 11.497 0 0 1 7.101.667a9.465 9.465 0 0 1 4.083 4.083 11.52 11.52 0 0 1-1.768 3.008l3.445 3.445c.644-.097 1.197.085 1.66.547l4.247 4.247c.376.377.565.836.565 1.377 0 .54-.192 1.002-.574 1.385Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const ActivityMintedSvg = (props: any) => (
  <svg width={16} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10 0H2C.9 0 .01.9.01 2L0 18c0 1.1.89 2 1.99 2H14c1.1 0 2-.9 2-2V6l-6-6Zm2 14H9v3H7v-3H4v-2h3V9h2v3h3v2ZM9 7V1.5L14.5 7H9Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const ActivityOfferSvg = (props: any) => (
  <svg width={18} height={10} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M0 6h2V4H0v2Zm0 4h2V8H0v2Zm0-8h2V0H0v2Zm4 4h14V4H4v2Zm0 4h14V8H4v2ZM4 0v2h14V0H4ZM0 6h2V4H0v2Zm0 4h2V8H0v2Zm0-8h2V0H0v2Zm4 4h14V4H4v2Zm0 4h14V8H4v2ZM4 0v2h14V0H4Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const EtherscanLinkSvg = (props: any) => (
  <svg width={10} height={10} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.875 1.667a.208.208 0 0 0-.209.208v6.25c0 .115.094.208.209.208h6.25a.208.208 0 0 0 .208-.208V6.14a.417.417 0 1 1 .833 0v1.985c0 .575-.466 1.042-1.041 1.042h-6.25A1.042 1.042 0 0 1 .833 8.125v-6.25c0-.575.466-1.042 1.042-1.042H3.75a.417.417 0 1 1 0 .834H1.875Zm6.458.589v2.327a.417.417 0 1 0 .833 0V1.25A.417.417 0 0 0 8.75.833H5.416a.417.417 0 1 0 0 .834h2.328L5.08 4.33a.417.417 0 0 0 .59.59l2.663-2.664Z"
      fill={props?.color || '#B794F6'}
    />
  </svg>
);

export const DiscordSvg = (props: any) => (
  <svg width={22} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M18.624 1.517A18.141 18.141 0 0 0 14.146.128a.068.068 0 0 0-.072.034c-.194.344-.408.793-.558 1.145a16.749 16.749 0 0 0-5.03 0A11.59 11.59 0 0 0 7.922.162a.07.07 0 0 0-.072-.034C6.277.398 4.774.873 3.37 1.517a.064.064 0 0 0-.03.025C.49 5.803-.292 9.96.091 14.064c.002.02.013.04.029.052a18.242 18.242 0 0 0 5.493 2.777.071.071 0 0 0 .077-.026c.423-.578.8-1.187 1.124-1.828a.07.07 0 0 0-.038-.096 12.013 12.013 0 0 1-1.716-.819.07.07 0 0 1-.007-.117 9.37 9.37 0 0 0 .34-.267.068.068 0 0 1 .072-.01c3.6 1.645 7.498 1.645 11.056 0a.068.068 0 0 1 .072.01c.11.09.226.181.342.268a.07.07 0 0 1-.006.117c-.548.32-1.118.59-1.717.817a.07.07 0 0 0-.038.097c.33.64.708 1.25 1.123 1.828a.07.07 0 0 0 .078.026 18.18 18.18 0 0 0 5.502-2.777.07.07 0 0 0 .028-.05c.459-4.746-.768-8.869-3.253-12.523a.055.055 0 0 0-.028-.026ZM7.352 11.565c-1.084 0-1.977-.995-1.977-2.217 0-1.223.875-2.218 1.977-2.218 1.11 0 1.994 1.004 1.977 2.218 0 1.222-.876 2.217-1.977 2.217Zm7.31 0c-1.084 0-1.977-.995-1.977-2.217 0-1.223.876-2.218 1.977-2.218 1.11 0 1.994 1.004 1.977 2.218 0 1.222-.867 2.217-1.977 2.217Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const TelegramSvg = (props: any) => (
  <svg width={30} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.25 9.17a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0ZM9.74 6.81 4.185 9.099c-.979.381-.406.739-.406.739s.834.286 1.55.5c.715.215 1.096-.023 1.096-.023L9.787 8.05c1.193-.811.906-.144.62.143-.62.62-1.645 1.597-2.503 2.384-.382.334-.191.62-.024.763.485.41 1.628 1.157 2.147 1.496.144.095.24.157.261.173.12.095.786.524 1.192.43.406-.096.454-.645.454-.645l.596-3.743.154-1.007c.13-.837.234-1.517.252-1.759.071-.81-.787-.477-.787-.477s-1.86.763-2.409 1.002Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const ClockSvg = (props: any) => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0ZM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Zm-1-6.93 5.49 3.29 1.02-1.72L11 9.93V4.42H9v6.65Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const SocialIconSVG = (props: any) => (
  <svg width={20} height={12} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.281 6c0 3.313-2.525 6-5.641 6a5.328 5.328 0 0 1-2.156-.454 5.622 5.622 0 0 1-1.829-1.3A6.049 6.049 0 0 1 .432 8.299 6.357 6.357 0 0 1 0 6c0-3.315 2.525-6 5.64-6a5.328 5.328 0 0 1 2.156.454c.684.3 1.306.742 1.83 1.3.524.557.94 1.219 1.224 1.947.284.729.43 1.51.431 2.299Zm6.188 0c0 3.12-1.263 5.648-2.82 5.648-1.558 0-2.82-2.53-2.82-5.648 0-3.12 1.262-5.648 2.82-5.648 1.557 0 2.82 2.53 2.82 5.648ZM20 6c0 2.795-.444 5.06-.992 5.06s-.992-2.267-.992-5.06c0-2.795.444-5.06.993-5.06C19.556.94 20 3.205 20 6Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const SocialIconSVG1 = (props: any) => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.183 6.917c-1.07-1.022-2.794-1.035-3.923-.066-1.314-.603-2.835-.986-4.468-1.078.604-1.79 1.847-4.292 3.099-4.532.42-.08.88.132 1.362.631-.035.133-.061.27-.061.41 0 .886.753 1.605 1.68 1.605.927 0 1.68-.717 1.68-1.604 0-.885-.753-1.603-1.68-1.603-.302 0-.585.083-.83.218-.764-.724-1.57-1.014-2.403-.856-2.434.468-3.907 4.829-4.186 5.725-1.719.074-3.319.467-4.69 1.102-1.126-.99-2.868-.982-3.946.047-1.063 1.015-1.083 2.641-.094 3.72A5.35 5.35 0 0 0 .22 12.87c0 3.93 4.402 7.13 9.812 7.13 5.41 0 9.814-3.198 9.814-7.13a5.37 5.37 0 0 0-.526-2.283c.944-1.077.908-2.67-.138-3.67ZM1.27 7.35c.78-.746 2.013-.795 2.887-.171-1.354.74-2.44 1.72-3.123 2.862-.597-.83-.524-1.967.236-2.69Zm8.764 11.426c-4.705 0-8.532-2.648-8.532-5.905 0-3.254 3.827-5.904 8.532-5.904 4.707 0 8.533 2.65 8.533 5.904 0 3.259-3.826 5.905-8.533 5.905Zm5.84-11.617c.873-.603 2.085-.545 2.857.192.747.711.83 1.818.272 2.643-.69-1.133-1.776-2.106-3.13-2.835ZM6.458 12.77c-.883 0-1.6-.684-1.6-1.528 0-.843.716-1.527 1.6-1.527.885 0 1.6.683 1.6 1.527 0 .844-.716 1.528-1.6 1.528Zm8.735-1.528c0 .842-.716 1.527-1.6 1.527-.883 0-1.6-.684-1.6-1.527 0-.845.716-1.528 1.6-1.528.883 0 1.6.683 1.6 1.527Zm-1.348 4.054a.591.591 0 0 1-.113.859c-1.335.988-2.632 1.322-3.767 1.322-2.271 0-3.901-1.325-3.925-1.346a.592.592 0 0 1-.062-.862.661.661 0 0 1 .9-.06c.12.097 2.904 2.326 6.07-.02a.661.661 0 0 1 .897.107Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);
export const LinkedinIconSVG = (props: any) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4.28501 19.9971H0V7.14258H4.28501V19.9971Z"
      fill={props?.color || '#F4B1A3'}
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.12976 4.28493H2.10542C0.826682 4.28493 0 3.33229 0 2.14173C0 0.925983 0.851859 0 2.15486 0C3.45787 0 4.26029 0.925983 4.28501 2.14173C4.28501 3.33229 3.45787 4.28493 2.12976 4.28493Z"
      fill={props?.color || '#F4B1A3'}
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19.9994 19.9968H15.7887V13.2776C15.7887 11.5898 15.1794 10.4382 13.6551 10.4382C12.4918 10.4382 11.7988 11.2146 11.4945 11.9644C11.3832 12.2332 11.3558 12.6076 11.3558 12.983V19.9971H7.14453C7.14453 19.9971 7.20003 8.61633 7.14453 7.43783H11.3558V9.21674C11.9147 8.36159 12.9157 7.14258 15.1513 7.14258C17.9222 7.14258 19.9996 8.938 19.9996 12.7957L19.9994 19.9968Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const NoChartSvg = (props: any) => (
  <svg width={154} height={120} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      stroke={props?.color || '#B794F6'}
      strokeWidth={3}
      strokeLinecap="round"
      d="M23.5 72.5h116M23.5 44.5h116M23.5 16.5h116M28.5 1.5v77M63.5 72.5v6M133.5 72.5v6M98.5 72.5v6"
    />
    <path
      d="M1.278 101.8h1.951l4.993 7.6h.032v-7.6h2.096V113H8.398l-4.992-7.584h-.033V113H1.277v-11.2Zm11.016 9.536v-4.64l1.648-1.664h4.576l1.648 1.664v4.64L18.518 113h-4.576l-1.648-1.664Zm5.2-.096.56-.56v-3.328l-.56-.56h-2.528l-.56.56v3.328l.56.56h2.528Zm9.148-9.44h2.176V113h-2.176v-11.2Zm5.082 9.568v-4.56h-1.44v-1.776h1.472v-2.592h2.08v2.592h2.432v1.792h-2.432v3.856l.544.528h1.888V113h-2.896l-1.648-1.632Zm5.61 0v-4.672l1.648-1.664h4.496l1.664 1.664v3.024h-5.696v1.024l.512.528h2.608l.48-.496v-.416h2.08v1.04l-1.584 1.6H38.95l-1.616-1.632Zm5.696-3.12v-.928l-.544-.56H39.99l-.544.56v.928h3.584Zm3.892-3.216h1.953v1.312l1.295-1.312h2.017l1.088 1.104 1.087-1.104h2.785l1.712 1.728V113h-2.113v-5.616l-.544-.56H54.86l-.849.848V113h-2.047v-5.648l-.513-.528h-.96l-1.456 1.472V113h-2.111v-7.968ZM68.48 101.8h1.984L74.56 113h-2.208l-.912-2.48h-3.936l-.912 2.48h-2.208l4.096-11.2Zm2.48 6.928-1.488-4.256h-.032L68 108.728h2.96Zm4.353 2.64v-4.704l1.617-1.632h4.383l1.648 1.664v1.472H80.85v-.784l-.56-.56h-2.305l-.56.56v3.264l.56.56h2.305l.56-.56v-.784h2.111v1.472L81.313 113h-4.385l-1.615-1.632Zm9.902 0v-4.56h-1.44v-1.776h1.472v-2.592h2.08v2.592h2.432v1.792h-2.432v3.856l.544.528h1.888V113h-2.896l-1.648-1.632Zm5.925-8v-1.024l.736-.736h1.12l.736.736v1.024l-.736.736h-1.12l-.736-.736Zm.24 1.664h2.112V113H91.38v-7.968Zm3.34 0h2.192l1.856 5.552h.064l1.856-5.552h2.192L99.823 113h-2.048l-3.056-7.968Zm9.136-1.664v-1.024l.736-.736h1.12l.736.736v1.024l-.736.736h-1.12l-.736-.736Zm.24 1.664h2.112V113h-2.112v-7.968Zm5.019 6.336v-4.56h-1.44v-1.776h1.472v-2.592h2.08v2.592h2.432v1.792h-2.432v3.856l.544.528h1.888V113h-2.896l-1.648-1.632Zm13.495-6.336v9.792l-1.728 1.712h-4.192l-1.488-1.472v-1.088h2.112v.48l.304.32h2.336l.544-.56v-2.4L119.313 113h-2.64l-1.712-1.728v-6.24h2.112v5.616l.544.56h1.392l1.488-1.584v-4.592h2.112Zm14.044 0v9.792l-1.728 1.712h-4.192l-1.488-1.472v-1.088h2.112v.48l.304.32h2.336l.544-.56v-2.4L133.357 113h-2.64l-1.712-1.728v-6.24h2.112v5.616l.544.56h1.392l1.488-1.584v-4.592h2.112Zm1.856 6.336v-4.672l1.648-1.664h4.496l1.664 1.664v3.024h-5.696v1.024l.512.528h2.608l.48-.496v-.416h2.08v1.04l-1.584 1.6h-4.592l-1.616-1.632Zm5.696-3.12v-.928l-.544-.56h-2.496l-.544.56v.928h3.584Zm4.612 3.12v-4.56h-1.44v-1.776h1.472v-2.592h2.08v2.592h2.432v1.792h-2.432v3.856l.544.528h1.888V113h-2.896l-1.648-1.632Z"
      fill="#fff"
    />
    <rect
      x={5.5}
      y={12.5}
      width={11}
      height={5}
      rx={2.5}
      fill={props?.color || '#B794F6'}
      stroke={props?.color || '#B794F6'}
      strokeWidth={3}
    />
    <rect
      x={5.5}
      y={39.5}
      width={11}
      height={5}
      rx={2.5}
      fill={props?.color || '#B794F6'}
      stroke={props?.color || '#B794F6'}
      strokeWidth={3}
    />
    <rect
      x={5.5}
      y={68.5}
      width={11}
      height={5}
      rx={2.5}
      fill={props?.color || '#B794F6'}
      stroke={props?.color || '#B794F6'}
      strokeWidth={3}
    />
  </svg>
);

export const RockSmallSvg = (props: any) => (
  <svg width={10} height={8} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m9.988 5.395-.02-.036a.166.166 0 0 1 0-.036L9.79 4.87c-.403-1.08-.842-2.157-1.262-3.226a.443.443 0 0 0-.403-.302c-.682-.028-1.363-.065-2.044-.101a.085.085 0 0 1-.045 0L5 .327 4.794.14A.435.435 0 0 0 4.5 0a.585.585 0 0 0-.23.065c-.318.153-.641.302-.956.447a1.75 1.75 0 0 1-.725.165c-.464 0-.928 0-1.391.033l-.54.02a.403.403 0 0 0-.404.403l-.024.403S.044 4.653 0 5.346a.431.431 0 0 0 .15.356l.58.508L1.9 7.23a.512.512 0 0 0 .25.117c.277.044.56.08.842.12l3.201.452a2.294 2.294 0 0 0 .42.029c.5-.085.996-.178 1.492-.275l.617-.117a.44.44 0 0 0 .314-.23l.762-1.338.145-.25.025-.036.032-.04v-.186l-.012-.08ZM.742 5.242c.064-1.077.125-2.153.19-3.226V1.75l1.334.839c-.206.536-.403 1.068-.609 1.613l-.161.427a.44.44 0 0 0 0 .359.448.448 0 0 0 .29.21l1.15.342-.807.928-.436-.391c-.318-.279-.633-.553-.951-.835ZM5.298 1.56l.137.117-.46 1.186-.108.278a31.976 31.976 0 0 1-3.077-1.71c.299 0 .597 0 .9-.024.278.002.553-.057.806-.173l.94-.428.862.754Zm2.016.456h.283s-.404 1.032-.585 1.476a.165.165 0 0 1-.024.044l-1.137.936-.077.064a.226.226 0 0 1 0-.048c-.072-.198-.141-.403-.23-.597a.589.589 0 0 1 0-.52c.166-.403.319-.806.464-1.177l.097-.254 1.21.076ZM2.88 2.94l1.56.806-.987 1.173-.94-.278-.214-.064.581-1.637Zm2.016 1.399L5.92 7.125 2.875 6.71l2.02-2.371Zm2.242.024 1.048 2.532-1.443.274-.694-1.875 1.089-.931Zm.585-.613c.129-.323.258-.645.403-.964l.032-.08S8.964 4.79 9.246 5.5l-.496.835-1.024-2.529c-.012-.028-.012-.04-.004-.056Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const DiamodSmallSvg = (props: any) => (
  <svg width={10} height={10} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8.5.5h-7L0 3.5l5 6 5-6-1.5-3ZM3.81 3l.75-1.5h.88L6.19 3H3.81Zm.69 1v3.34L1.72 4H4.5Zm1 0h2.78L5.5 7.34V4Zm3.13-1H7.305l-.75-1.5H7.88L8.63 3ZM2.12 1.5h1.325L2.695 3H1.37l.75-1.5Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const WarningSvg = (props: any) => (
  <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8.166 4.833h1.667v1.666H8.166V4.833Zm0 3.333h1.667v5H8.166v-5Zm.833-7.5A8.336 8.336 0 0 0 .666 8.999c0 4.6 3.733 8.334 8.333 8.334s8.334-3.734 8.334-8.334S13.599.666 8.999.666Zm0 15a6.676 6.676 0 0 1-6.666-6.667 6.676 6.676 0 0 1 6.666-6.666 6.676 6.676 0 0 1 6.667 6.666 6.676 6.676 0 0 1-6.667 6.667Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const EditSvg = (props: any) => (
  <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m12.295.693 1.012 1.012a1.49 1.49 0 0 1 0 2.123L3.385 13.75H.25v-3.135l7.8-7.807L10.172.693a1.503 1.503 0 0 1 2.123 0ZM1.75 12.25l1.058.045 7.364-7.372-1.057-1.058L1.75 11.23v1.02Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const TwitterSvg = (props: any) => (
  <svg width={18} height={19} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M.75 14.33a9.615 9.615 0 0 0 5.166 1.497c5.336 0 9.662-4.327 9.662-9.662 0-.134-.002-.266-.008-.397.193-.152 1.387-1.11 1.68-1.724 0 0-.97.403-1.918.497h-.006l.005-.003c.087-.059 1.31-.892 1.475-1.883 0 0-.686.366-1.646.686-.16.053-.325.105-.497.153a3.39 3.39 0 0 0-5.778 3.083c-.261-.01-4.247-.235-6.959-3.518 0 0-1.62 2.213.966 4.487 0 0-.786-.031-1.464-.436 0 0-.25 2.68 2.68 3.366 0 0-.576.217-1.496.063 0 0 .514 2.165 3.117 2.367-.002.002-2.059 1.86-4.979 1.425Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const TeleSvg = (props: any) => (
  <svg width={18} height={19} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.25 9.17a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0ZM9.74 6.81 4.185 9.099c-.979.381-.406.739-.406.739s.834.286 1.55.5c.715.215 1.096-.023 1.096-.023L9.787 8.05c1.193-.811.906-.144.62.143-.62.62-1.645 1.597-2.503 2.384-.382.334-.191.62-.024.763.485.41 1.628 1.157 2.147 1.496.144.095.24.157.261.173.12.095.786.524 1.192.43.406-.096.454-.645.454-.645l.596-3.743.154-1.007c.13-.837.234-1.517.252-1.759.071-.81-.787-.477-.787-.477s-1.86.763-2.409 1.002Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const CheckedSvg = (props: any) => (
  <svg width={48} height={48} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M24 4C12.96 4 4 12.96 4 24s8.96 20 20 20 20-8.96 20-20S35.04 4 24 4Zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16Zm9.18-24.84L20 28.34l-5.18-5.16L12 26l8 8 16-16-2.82-2.84Z"
      fill={props?.color || '#F4B1A3'}
    />
  </svg>
);

export const StakingSvg = (props: any) => (
  <svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill={props?.color || '#F4B1A3'} d="M0 0h64v64H0z" />
    <path
      d="M44.366 18.686a1 1 0 0 0-.895-.553H19.82a1 1 0 0 0-.895.553l-4.764 9.529a1 1 0 0 0 .126 1.087l16.59 19.909a1 1 0 0 0 1.537 0L49.004 29.3a1 1 0 0 0 .126-1.086l-4.764-9.53Zm-15.334 8.336a1 1 0 0 1-.895-1.447l1.667-3.334a1 1 0 0 1 .895-.553h1.892a1 1 0 0 1 .895.553l1.667 3.334a1 1 0 0 1-.895 1.447h-5.226Zm-.165 3.555a1 1 0 0 1 1 1v8.111c0 .936-1.17 1.359-1.768.64l-6.752-8.111a1 1 0 0 1 .77-1.64h6.75Zm4.556 1a1 1 0 0 1 1-1h6.75a1 1 0 0 1 .77 1.64l-6.752 8.111c-.598.719-1.768.296-1.768-.64v-8.11Zm10.405-6.003a1 1 0 0 1-.894 1.448h-2.475a1 1 0 0 1-.895-.553l-1.666-3.333a1 1 0 0 1 .894-1.448h2.475a1 1 0 0 1 .894.553l1.667 3.334Zm-22.7-3.333a1 1 0 0 1 .895-.553h2.475a1 1 0 0 1 .894 1.448l-1.666 3.333a1 1 0 0 1-.895.553h-2.475a1 1 0 0 1-.894-1.447l1.667-3.334Z"
      fill="#010B19"
    />
  </svg>
);

export const GameSvg = (props: any) => (
  <svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill={props?.color || '#F4B1A3'} d="M0 0h64v64H0z" />
    <path
      d="m49.032 39.271-1.938-13.618a7.104 7.104 0 0 0-7.04-6.097H23.947a7.104 7.104 0 0 0-7.04 6.097L14.97 39.271a4.525 4.525 0 0 0 4.48 5.174c1.21 0 2.347-.48 3.2-1.334l4.018-4h10.667l4 4a4.537 4.537 0 0 0 3.2 1.334 4.528 4.528 0 0 0 4.498-5.174Zm-3.734 1.28a.96.96 0 0 1-.746.338.982.982 0 0 1-.694-.284l-5.048-5.05H25.191l-5.05 5.05a.982.982 0 0 1-.692.284.96.96 0 0 1-.747-.338.925.925 0 0 1-.231-.782l1.938-13.618c.266-1.724 1.777-3.04 3.537-3.04h16.107a3.575 3.575 0 0 1 3.52 3.058l1.938 13.618a.965.965 0 0 1-.214.764Z"
      fill="#010B19"
    />
    <path
      d="M26.667 24.889H24.89v3.555h-3.556v1.778h3.556v3.556h1.777v-3.556h3.556v-1.778h-3.556V24.89ZM40.89 33.778a1.778 1.778 0 1 0 0-3.555 1.778 1.778 0 0 0 0 3.555ZM37.334 28.444a1.778 1.778 0 1 0 0-3.555 1.778 1.778 0 0 0 0 3.555Z"
      fill="#010B19"
    />
  </svg>
);

export const GovernanceSvg = (props: any) => (
  <svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill={props?.color || '#F4B1A3'} d="M0 0h64v64H0z" />
    <path
      d="M10.667 28.63a1 1 0 0 0 1 1h16.952a1 1 0 0 0 1-1V11.667a1 1 0 0 0-1-1H11.667a1 1 0 0 0-1 1V28.63Zm4.738-12.222a1 1 0 0 1 1-1h7.476a1 1 0 0 1 1 1v7.481a1 1 0 0 1-1 1h-7.476a1 1 0 0 1-1-1v-7.481Zm-4.738 35.926a1 1 0 0 0 1 1h16.952a1 1 0 0 0 1-1V35.37a1 1 0 0 0-1-1H11.667a1 1 0 0 0-1 1v16.963Zm4.738-12.223a1 1 0 0 1 1-1h7.476a1 1 0 0 1 1 1v7.482a1 1 0 0 1-1 1h-7.476a1 1 0 0 1-1-1V40.11Zm19.953-29.444a1 1 0 0 0-1 1V28.63a1 1 0 0 0 1 1H52.31a1 1 0 0 0 1-1V11.667a1 1 0 0 0-1-1H35.357Zm13.214 13.222a1 1 0 0 1-1 1h-7.476a1 1 0 0 1-1-1v-7.481a1 1 0 0 1 1-1h7.476a1 1 0 0 1 1 1v7.481Z"
      fill="#010B19"
    />
    <mask id="a" fill="#fff">
      <rect x={34.134} y={34.134} width={19.2} height={19.2} rx={1} />
    </mask>
    <rect
      x={34.134}
      y={34.134}
      width={19.2}
      height={19.2}
      rx={1}
      fill="#010B19"
      stroke="#010B19"
      strokeWidth={10}
      mask="url(#a)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.108 45.303a1 1 0 0 1-1.403 0l-1.851-1.824a.715.715 0 0 0-1.003 1.018l2.854 2.812a1 1 0 0 0 1.404 0l7.508-7.397a.714.714 0 1 0-1.003-1.018l-6.505 6.41Z"
      fill="#FFB3AA"
    />
  </svg>
);

export const VRSvg = (props: any) => (
  <svg width={65} height={64} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill={props?.color || '#F4B1A3'} d="M.17 0h64v64h-64z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M51.593 27.284c1.206 1.015 1.91 2.603 1.91 4.289v9.734c0 2.393-1.41 4.514-3.491 5.178l-17.413 5.568-.003.001c-1.46.472-3.031.148-4.24-.879-1.206-1.015-1.91-2.603-1.91-4.289v-9.734c0-2.386 1.413-4.505 3.492-5.169l17.413-5.577.002-.001c1.46-.472 3.031-.148 4.24.879Zm-1.624 2.352a1.933 1.933 0 0 0-1.869-.387h-.004l-17.418 5.58c-.917.293-1.56 1.237-1.56 2.323v9.734c0 .771.323 1.483.856 1.931l.003.003.004.003a1.933 1.933 0 0 0 1.868.387l.005-.001 17.417-5.57h.001c.915-.292 1.56-1.234 1.56-2.332v-9.734c0-.772-.323-1.483-.857-1.932l-.003-.002-.003-.003Z"
      fill="#1F1A1B"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.896 24.028a4.176 4.176 0 0 1 3.323.32l-1.132 2.738a1.859 1.859 0 0 0-1.478-.14l-17.156 5.7c-.901.299-1.536 1.263-1.536 2.387v9.965c0 .79.317 1.519.843 1.977l.01.008.008.009c.072.065.167.133.278.198l-1.187 2.706a4.273 4.273 0 0 1-.708-.512c-1.185-1.04-1.877-2.663-1.877-4.386v-9.965c0-2.45 1.39-4.62 3.44-5.3l17.167-5.704.005-.001ZM29.53 23.343c.709-.163 1.181-.95 1.06-1.781-.122-.846-.813-1.416-1.543-1.274a2.155 2.155 0 0 0-.339.099l-15.655 5.238c-1.208.404-2.063 1.624-2.2 3.048v.01l-.001.01c-.123 1.443.52 2.835 1.624 3.51h.001l3.438 2.106c.655.4 1.465.11 1.81-.648.346-.758.096-1.698-.558-2.098l-3.44-2.107h-.002a.49.49 0 0 1-.208-.449c.023-.206.145-.353.279-.398m0 0 5.718-1.913 9.99-3.343.026-.01M12.222 33.304c.765 0 1.385.707 1.385 1.579 0 .172.085.332.219.413l3.557 2.143c.677.407.935 1.363.578 2.134-.357.771-1.195 1.066-1.872.659l-3.557-2.143c-1.04-.626-1.695-1.86-1.695-3.206 0-.872.62-1.58 1.385-1.58Z"
      fill="#1F1A1B"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.837 34.488v-5.925h3.122v5.925h-3.122ZM40.743 23.894a1.758 1.758 0 0 0-1.32-.302c-.733.127-1.412-.5-1.515-1.403-.104-.902.407-1.737 1.14-1.864 1.033-.18 2.084.056 2.997.685l8.663 5.63c.655.425.905 1.423.56 2.228-.346.806-1.157 1.114-1.812.689l-8.696-5.651-.017-.012ZM26.991 26.482h.003l1.108.271.004.002c1.397.353 2.82.408 4.231.18l.353 3.02c-1.701.274-3.427.21-5.126-.22l-1.11-.271a7.473 7.473 0 0 0-4.221.175c-.891.301-1.515 1.272-1.515 2.39v10.027c0 .775.308 1.51.83 1.985.098.085.177.148.242.193l8.62 5.337-1.21 2.696-8.66-5.362-.018-.011a5.326 5.326 0 0 1-.53-.412l-.009-.008-.009-.008c-1.165-1.05-1.853-2.68-1.853-4.41V32.028c0-2.455 1.373-4.636 3.394-5.318h.002a9.7 9.7 0 0 1 5.474-.228ZM22.244 11.994c.168.866-.213 1.753-.85 1.981a.963.963 0 0 0-.257.13l-.006.004-.007.005c-.375.273-.615.813-.615 1.401v6.686c0 .895-.535 1.621-1.194 1.621-.66 0-1.194-.726-1.194-1.621v-6.686c0-1.78.722-3.416 1.87-4.255.28-.209.555-.335.794-.42.638-.23 1.29.288 1.459 1.154Z"
      fill="#1F1A1B"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.51 9.774c1.121-.367 2.34-.15 3.323.602l.007.005 6.797 5.323h.001c2.043 1.594 3.255 4.234 3.255 7.057v4.366h-2.69v-4.366c0-1.834-.785-3.529-2.09-4.546l-.002-.002-6.785-5.313a1.163 1.163 0 0 0-1.066-.2l-.514.175 5.508 4.314c1.253.97 2.193 2.342 2.727 3.906.337.979.53 2.049.53 3.152v4.316h-2.69v-4.316c0-.703-.123-1.399-.346-2.045l-.002-.006c-.342-1.003-.943-1.877-1.738-2.492l-.003-.003-6.793-5.32a1.165 1.165 0 0 0-1.03-.208l-.707-2.94 4.301-1.457.006-.002Z"
      fill="#1F1A1B"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.325 11.97c.575 0 1.04.642 1.04 1.434v6.613c0 .792-.465 1.434-1.04 1.434s-1.04-.642-1.04-1.434v-6.613c0-.792.465-1.434 1.04-1.434ZM46.167 37.96c.205.808-.205 1.652-.915 1.885l-8.771 2.88c-.71.232-1.451-.234-1.656-1.042-.205-.809.205-1.653.915-1.886l8.771-2.879c.71-.233 1.451.234 1.656 1.042Z"
      fill="#1F1A1B"
    />
  </svg>
);

export const SaleLegendSvg = (props: any) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        d="M0 19.5c.333-2 .96-6.5 3-6.5 2.5 0 2.5 4 5 4 3 0 4.264-10.5 6.5-10.5 1.5 0 2 5.5 4.5 5.5s5-9 5-9"
        stroke={props.color ? props.color : "#F4B1A3"}
      />
      <path fill="url(#b)" d="M16 0h8v24h-8z" />
      <path transform="rotate(-180 8 24)" fill="url(#c)" d="M8 24h8v24H8z" />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={24}
        y1={10.5}
        x2={16}
        y2={10.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2D2D39" />
        <stop offset={1} stopColor="#2D2D39" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="c"
        x1={16}
        y1={34.5}
        x2={8}
        y2={34.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2D2D39" />
        <stop offset={1} stopColor="#2D2D39" stopOpacity={0} />
      </linearGradient>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const DiamondSmallSvg = (props:any) => (
  <svg
    width={54}
    height={54}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#a)">
      <path
        d="M58 24H30l-6 12 20 24 20-24-6-12ZM39.24 34l3-6h3.52l3 6h-9.52ZM42 38v13.36L30.54 38H42Zm4 0h11.12L46 51.36V38Zm12.52-4h-5.3l-3-6h5.3l3 6Zm-26.04-6h5.3l-3 6h-5.3l3-6Z"
        fill={props?.color || '#F4B1A3'}
      />
    </g>
    <defs>
      <filter
        id="a"
        x={-4}
        y={-6}
        width={54}
        height={54}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={12} />
        <feColorMatrix values="0 0 0 0 0.956863 0 0 0 0 0.694118 0 0 0 0 0.639216 0 0 0 0.5 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2966_56081"
        />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={3} />
        <feColorMatrix values="0 0 0 0 0.956863 0 0 0 0 0.694118 0 0 0 0 0.639216 0 0 0 0.5 0" />
        <feBlend
          in2="effect1_dropShadow_2966_56081"
          result="effect2_dropShadow_2966_56081"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect2_dropShadow_2966_56081"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
)

