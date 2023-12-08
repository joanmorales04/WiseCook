import '../App.css'; // Import App.css from the parent directory
import header from '../images/header.jpeg';

const Hero = (props) => {
  return (

    <div className={props.cName}>

      <img className="hero-image" alt="heroImage" src={header}  />

      <div className="hero-text">

        <h2 id="hero-title">{props.title}</h2>

        <p>{props.text}</p>

      </div>

    </div>
  );
};

export default Hero;