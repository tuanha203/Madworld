const WalletConnectScanQR = () => {
  return (
    <div className="gap-8">
      <div className="w-60 mb-8 mx-auto">
        <img className="w-full" src="/images/wallet/qr-code-example.png" alt="qr-code-example" />
      </div>
      <div className="text--label-large text-white mb-16">
        Scan QR code with
        <div>WalletConnect-compatible wallet</div>
      </div>
      <div className="text--label-large text-primary-dark">Copy to clipboard</div>
    </div>
  );
};

export default WalletConnectScanQR;
