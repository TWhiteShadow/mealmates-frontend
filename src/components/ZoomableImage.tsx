import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

type ZoomableImageProps = {
    src: string;
    alt?: string;
    className?: string;
};

export const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt, className }) => {
    return (
        <Zoom>
            <img src={src} alt={alt} className={className} />
        </Zoom>
    );
}
