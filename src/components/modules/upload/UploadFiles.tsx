import { FC, HTMLAttributes, HtmlHTMLAttributes, ReactNode, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { FormHelperText } from '@mui/material';
import { OutlinedButton } from 'components/common';
import { IconDynamic } from 'components/common/iconography/IconBundle';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { validateFile } from 'utils/file';
import { toastError } from 'store/actions/toast';
import { useDispatch } from 'react-redux';

interface IUploadFilesProps {
  onChange: (e: any) => void;
  onRemove: () => void;
  value?: File | Blob;
  title: string;
  error?: boolean;
  required?: boolean;
  helperText?: string;
  description?: Element | string | ReactNode;
  className?: string;
  inputProps?: HTMLAttributes<HTMLInputElement>;
}

const UploadFiles: FC<IUploadFilesProps> = (props) => {
  const {
    value,
    onChange: setFile,
    onRemove,
    className,
    title,
    required,
    helperText,
    description,
    error,
    inputProps,
  } = props;

  const [previewUrl, setPreviewUrl] = useState<File | string | null>();
  const dispatch = useDispatch();
  
  const handleRemove = () => {
    setFile(undefined);
    URL.revokeObjectURL(previewUrl as string);
    setPreviewUrl(null);
    onRemove && onRemove();
  };

  const handleChange = (e: any) => {
    let file = e.target.files[0];
    if (file && !validateFile(file.type.split('/')[1])) {
      return dispatch(toastError('Invalid format'))
    }
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      e.target.value = null;
    }
  };

  useEffect(() => {
    return () => {
      if (value) {
        URL.revokeObjectURL(previewUrl as string);
        setPreviewUrl(null);
      }
    };
  }, []);

  return (
    <div className={`upload-media flex flex-col justify-between lg:gap-4 gap-2 ${className || ''}`}>
      <div className="text--label-large capitalize">
        {title}
        {required && <span className="text-red-600">*</span>}
        <div className='lg:hidden block mt-1'>
          {description && description}
        </div>
      </div>
      <div className="border border-dashed rounded p-3 w-full lg:h-[178px] sm:h-[128px]">
        <>
          <div className="image-upload-nft h-full flex flex-col justify-center items-center relative">
            <div className="absolute w-full inset-0 flex justify-center items-center flex-col">
              {!value && (
                <IconButton color="primary">
                  <FileUploadIcon
                    className="text-red"
                    style={{ color: '#F4B1A3', fontSize: 40 }}
                  />
                </IconButton>
              )}
              <div>
                <label htmlFor="icon-button-file">
                  <OutlinedButton
                    aria-label="upload picture"
                    text="Choose file"
                    customClass="!text--label-large"
                    dark
                  >
                    <input
                      className="absolute p-2.5 w-full opacity-0 z-10 cursor-pointer"
                      accept="image/*"
                      type="file"
                      onChange={handleChange}
                      {...inputProps}
                    />
                  </OutlinedButton>
                </label>
              </div>
            </div>
            {previewUrl && (
              <>
                <IconDynamic
                  className="absolute top-5 right-5 cursor-pointer"
                  image="/icons/close-2.svg"
                  onClick={handleRemove}
                />
                <img
                  className="z-20 w-full object-cover overflow-hidden"
                  src={previewUrl as string}
                  alt="previewImage"
                />
              </>
            )}
          </div>
        </>
      </div>
      <div className="text--body-small text-light-on-primary">
        {error && (
          <FormHelperText
            className={`text--body-small font-medium !text-error-60 pl-4`}
            error={error}
          >
            {helperText}
          </FormHelperText>
        )}
        <div className='lg:block hidden'>
          {description && description}
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
