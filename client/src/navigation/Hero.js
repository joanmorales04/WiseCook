import '../App.css'; // Import App.css from the parent directory

const Hero = (props) => {
  return (

    <div className={props.cName}>

      <img className="hero-image" alt="heroImage"  src={props.heroImg}> 
      </img>

      <div className="hero-text">

        <h2>{props.title}</h2>

        <p>{props.text}</p>

      </div>

    </div>
  );
};

export default Hero;