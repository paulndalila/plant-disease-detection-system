import logo from "./images/crop.png";
import Info from "./Info";

const Navbar = () => {
  return (
    <nav>
        <div className="nav_top">
            <div className="logo">
                <img src={ logo } alt="logo"/>
                <h3>Crop Oracle</h3>
            </div>
            <h5 className="more"><Info/></h5>
        </div>
        <div className="banner">
            <p>Crop Oracle is a plant disease detection system that detects diseases in plants by examining the crop leaf using machine learning. Start by selecting your crop here:</p>
        </div>
    </nav>
  )
}

export default Navbar