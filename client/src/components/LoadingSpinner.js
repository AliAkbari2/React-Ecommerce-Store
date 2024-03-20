import Spinner from "react-bootstrap/Spinner";
//Bootstrap spinner component 
//If loading is required, load bootstrap spinner animation
export default function LoadingSpinner() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden"></span>
    </Spinner>
  );
}
