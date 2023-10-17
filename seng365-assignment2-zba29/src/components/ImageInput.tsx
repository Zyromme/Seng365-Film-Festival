interface ImageInputProps {
  onImageSelect: (image: File) => void;
  isRequired: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  onImageSelect,
  isRequired,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="image-input">
      <input
        required={isRequired}
        type="file"
        accept="image/jpg, image/jpeg, image/png, image/gif"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default ImageInput;
