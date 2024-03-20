import Alert from "react-bootstrap/Alert";

//Bootstrap alert component 
//Alerts user with a message box 
export default function AlertMessage(props) {
  return <Alert variant={props.variant || "info"}>{props.children}</Alert>;
}

