import StarIcon from '@mui/icons-material/Star';

interface OrderCardProps {
  image: string;
  title: string;
  rating: number;
}

const OrderCard = ({ image, title, rating }: OrderCardProps) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg drop-shadow-lg">
      <img src={image} alt={title} className="w-16 h-16 rounded-lg object-cover" />
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="text-purple-dark flex items-center gap-0.5">
            <StarIcon sx={{ fontSize: "1rem" }}/> 
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
