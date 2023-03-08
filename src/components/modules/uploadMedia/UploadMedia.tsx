import IconButton from '@mui/material/IconButton';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { OutlinedButton } from 'components/common';
import { FormHelperText } from '@mui/material';
import { IconDynamic } from 'components/common/iconography/IconBundle';
import MediaPlayCreateNft from 'components/common/media-player/media-play-create-nft';
import { TYPE_MEDIA_NFT } from 'constants/app';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Model = dynamic(() => import('../../common/model'), { ssr: false });

const UploadMedia = ({ changeHandlerFile, changeHandlerNftPreview, formik = {} }: any) => {
  const { errors, values, touched, setFieldValue, setFieldError, setFieldTouched } = formik;
  const { nftAudio, nftVideo, nftImagePreview, nftModel } = values;
  const isUploadUrl = nftAudio || nftVideo;
  const [nftModelSchema, setNftModelSchema] = useState<any>(null);

  const handleRemoveFile = () => {
    setFieldValue('nftAudio', '');
    setFieldValue('nftVideo', '');
    setFieldValue('nftModel', '');
    setFieldValue('nftImagePreview', '');
    setNftModelSchema(null);
    // setFieldTouched('nftImagePreview', true);
    // setFieldError('nftImagePreview', 'NFT Content is not allowed to be empty.');
    setTimeout(() => {
      setFieldTouched('nftImagePreview', true);
      setFieldError('nftImagePreview', 'NFT Content is not allowed to be empty.');
    }, 200)
  };

  useEffect(() => {
    if (nftModel) {
      const newNftModelSchema = URL.createObjectURL(nftModel);
      setNftModelSchema(newNftModelSchema);
    }
  }, [nftModel]);

  function clearFileInput(fieldInput: any) {
    try {
      fieldInput.value = null;
    } catch(ex) { }
    if (fieldInput.value) {
      fieldInput.parentNode.replaceChild(fieldInput.cloneNode(true), fieldInput);
    }
  }

  return (
    <>
      <div
        style={{ backgroundImage: `url("/images/upload-bg.png` }}
        className={`lg:w-[480px] lg:p-12 lg:gap-[20px] p-6 upload-media w-full flex flex-col justify-between gap-[16px] ${
          isUploadUrl ? 'h-fit' : 'lg:min-h-[450px] min-h-[410px]'
        }`}
      >
        <div className="lg:text-base font-bold text-sm">
          Upload file<span className="text-error-60">*</span>
        </div>
        <div
          className={`border border-dashed rounded lg:w-[384px] w-full p-3 ${
            isUploadUrl ? 'lg:max-h-[302px] max-h-[254px]' : 'lg:h-[302px] h-[254px]'
          }`}
        >
          <>
            <div
              className={`image-upload-nft h-full flex flex-col justify-center relative h-full ${
                nftAudio || nftVideo ? '!items-end' : 'items-center'
              }`}
            >
              <div
                className={`absolute w-full inset-0 flex justify-center items-center flex-col w-fit h-fit m-auto`}
              >
                {!nftAudio && !nftVideo && !nftImagePreview && !nftModel && (
                  <>
                    <IconButton color="primary">
                      <FileUploadOutlinedIcon className=" text-primary-60" />
                    </IconButton>
                    <div className="w-max">
                      <label htmlFor="icon-button-file">
                        <OutlinedButton
                          aria-label="upload picture"
                          text="Choose file"
                          customClass="!text--label-large"
                          dark
                        >
                          <input
                            defaultValue=""
                            id="file"
                            name="file"
                            className="absolute p-2.5 w-full opacity-0 z-10 cursor-pointer"
                            accept="
                              video/mp4,
                              video/webm,
                              audio/ogg,
                              audio/mp3,
                              audio/wav,
                              audio/mpeg,
                              image/png,
                              image/jpg,
                              image/jpeg,
                              image/gif,
                              image/svg+xml,
                              .glb,
                              .gltf"
                            type="file"
                            onChange={changeHandlerFile}
                          />
                        </OutlinedButton>
                      </label>
                    </div>
                  </>
                )}
                {!nftAudio && !nftVideo && !nftModel && nftImagePreview && (
                  <div className="w-max">
                    <label htmlFor="icon-button-file">
                      <OutlinedButton
                        aria-label="upload picture"
                        text="Choose file"
                        customClass="!text--label-large"
                        dark
                      >
                        <input
                          id="file"
                          name="file"
                          className="absolute p-2.5 w-full opacity-0 z-10 cursor-pointer"
                          multiple
                          type="file"
                          onChange={changeHandlerFile}
                        />
                      </OutlinedButton>
                    </label>
                  </div>
                )}
              </div>
              {nftAudio && (
                <>
                  <IconDynamic
                    className="cursor-pointer"
                    image="/icons/close-2.svg"
                    onClick={handleRemoveFile}
                  />
                  <MediaPlayCreateNft
                    file={nftAudio}
                    key={nftAudio.lastModifiedDate}
                    customClassName="!z-20 !w-full lg:max-h-[278px]"
                    type={TYPE_MEDIA_NFT.AUDIO}
                  />
                </>
              )}
              {nftVideo && (
                <>
                  <IconDynamic
                    className="absolute top-4 right-4 cursor-pointer"
                    image="/icons/close-2.svg"
                    onClick={handleRemoveFile}
                  />
                  <MediaPlayCreateNft
                    file={nftVideo}
                    key={nftVideo.lastModifiedDate}
                    customClassName="!z-20 !w-full max-h-[278px]"
                    type={TYPE_MEDIA_NFT.VIDEO}
                  />
                </>
              )}
              {nftModelSchema && (
                <>
                  <IconDynamic
                    className="absolute top-5 right-5 cursor-pointer z-[10]"
                    image="/icons/close-2.svg"
                    onClick={handleRemoveFile}
                  />
                  <Model
                    src={nftModelSchema}
                    poster={nftImagePreview ? URL.createObjectURL(nftImagePreview) : ''}
                  />
                </>
              )}
              {!nftModel && !nftAudio && !nftVideo && nftImagePreview && (
                <>
                  <IconDynamic
                    className="absolute top-5 right-5 cursor-pointer"
                    image="/icons/close-2.svg"
                    onClick={handleRemoveFile}
                  />
                  <img
                    className="z-20 object-contain"
                    style={{ width: '100%', height: '100%', margin: 'auto' }}
                    src={URL.createObjectURL(nftImagePreview)}
                    alt=""
                  />
                </>
              )}
            </div>
          </>
        </div>
        <div className="text--body-small text-light-on-primary">
          {errors?.nftImagePreview && !values?.nftAudio && !values?.nftVideo && !values?.nftModel && (
            <FormHelperText
              className={`text--body-small text-xs font-normal !text-error-60 pl-4`}
              error={Boolean(errors?.nftImagePreview)}
            >
              {touched.nftImagePreview && errors?.nftImagePreview}
            </FormHelperText>
          )}
          {values?.nftAudio && errors?.nftAudio && (
            <FormHelperText
              className={`text--body-small text-xs font-normal !text-error-60 pl-4`}
              error={Boolean(errors?.nftAudio)}
            >
              {errors?.nftAudio}
            </FormHelperText>
          )}
          {values?.nftVideo && errors?.nftVideo && (
            <FormHelperText
              className={`text--body-small text-xs font-normal !text-error-60 pl-4`}
              error={Boolean(errors?.nftVideo)}
            >
              {errors?.nftVideo}
            </FormHelperText>
          )}
          <div className="font-normal text-xs text-archive-Neutral-Variant70 font-normal">
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size:
            100 MB
          </div>
        </div>
        {(nftAudio || nftVideo || nftModel) && (
          <div className="w-max">
            <label htmlFor="icon-button-file">
              <OutlinedButton
                aria-label="upload picture"
                text="Choose file"
                customClass="!text--label-large"
                dark
              >
                <input
                  defaultValue=""
                  className="absolute p-2.5 w-full opacity-0 z-10 cursor-pointer"
                  multiple
                  type="file"
                  onChange={changeHandlerFile}
                />
              </OutlinedButton>
            </label>
          </div>
        )}
      </div>

      {(nftAudio || nftVideo || nftModel) && (
        <div
          style={{ backgroundImage: `url("/images/upload-bg.png` }}
          className="lg:w-[480px] lg:p-12 lg:min-h-[450px] p-6 upload-media flex flex-col justify-between gap-4 mt-[17px]"
        >
          <div className="lg:text-base font-bold text-sm">
            Upload cover<span className="text-error-60">*</span>
          </div>
          <div className="border border-dashed rounded lg:w-[384px] lg:h-[302px] h-[254px] p-3">
            <>
              <div className="image-upload-nft h-full flex flex-col justify-center items-center relative">
                <div className="absolute w-full inset-0 flex justify-center items-center flex-col w-fit h-fit m-auto">
                  {!nftImagePreview && (
                    <IconButton color="primary">
                      <FileUploadOutlinedIcon className=" text-primary-60" />
                    </IconButton>
                  )}
                  <div className="w-max">
                    <label htmlFor="icon-button-file">
                      <OutlinedButton
                        aria-label="upload picture"
                        text="Choose file"
                        customClass="!text--label-large"
                        dark
                      >
                        <input
                          id="uploadImage"
                          className="absolute p-2.5 w-full opacity-0 z-10 cursor-pointer"
                          accept="image/png, image/jpg, image/jpeg, image/gif, image/svg+xml,"
                          type="file"
                          onChange={changeHandlerNftPreview}
                        />
                      </OutlinedButton>
                    </label>
                  </div>
                </div>
                {nftImagePreview && (
                  <>
                    <IconDynamic
                      className="absolute top-5 right-5 cursor-pointer"
                      image="/icons/close-2.svg"
                      onClick={() => {
                        setFieldValue('nftImagePreview', '');
                        clearFileInput(document.getElementById('uploadImage'));
                      }}
                    />
                    <img
                      className="z-20 !object-contain"
                      style={{ width: '100%', height: '100%', margin: 'auto' }}
                      src={URL.createObjectURL(nftImagePreview)}
                      alt=""
                    />
                  </>
                )}
              </div>
            </>
          </div>
          <div className="text--body-small text-light-on-primary">
            {touched.nftImagePreview && errors?.nftImagePreview && (
              <FormHelperText
                className={`text--body-small text-xs font-normal !text-error-60 pl-4`}
                error={touched.nftImagePreview && Boolean(errors?.nftImagePreview)}
              >
                {touched.nftImagePreview && errors?.nftImagePreview}
              </FormHelperText>
            )}
            <div className="font-normal text-xs text-archive-Neutral-Variant70 font-normal">
              File types supported: JPG, PNG, GIF. Max size: 100 MB
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadMedia;
