import React, { useState } from "react";
import { Button, Modal, Slider } from "antd";

import "./corp.css";
import Cropper from "react-easy-crop";
import getCroppedImg, {
  dataURLtoFile,
  generateDownload,
} from "../../asset/utils/utils";

export const MyImgCorp = ({ isActive, onChangeActive, image, onUpload }) => {
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const onCropComplete = (croppedAreaPercenttage, cropperAreaPixel) => {
    setCroppedArea(cropperAreaPixel);
  };

  const onDownload = () => {
    generateDownload(image, croppedArea);
  };

  const onConvertAndUpload = async () => {
    const canvas = await getCroppedImg(image, croppedArea);
    const canvasDataUrl = canvas.toDataURL("image/jpeg");
    const convertedUrlToFile = dataURLtoFile(
      canvasDataUrl,
      "cropped-image.jpeg"
    );
    const formdata = new FormData();
    formdata.append("croppedImage", convertedUrlToFile);
    onUpload(formdata);
    onChangeActive();
  };

  return (
    <Modal
      title="Изменить аватар"
      visible={isActive}
      okText="Create"
      onCancel={() => onChangeActive()}
      // onOk={onSaveForm}

      footer={[
        <Button key="submit" type="primary" onClick={onConvertAndUpload}>
          Сохранить
        </Button>,
      ]}
    >
      <div className="crop">
        <div className="crop__container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="crop__slider">
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(zoom) => setZoom(zoom)}
          />
        </div>
        {/*<div className="crop__slider">*/}
        {/*  <Slider*/}
        {/*    min={-180}*/}
        {/*    max={180}*/}
        {/*    step={1}*/}
        {/*    value={rotation}*/}
        {/*    onChange={(rotation) => setRotation(rotation)}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </Modal>
  );
};
