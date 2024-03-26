import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon component
import { faBullseye, faList,faCalendar} from '@fortawesome/free-solid-svg-icons'; // Import specific icons you need

const Targets = () => {
  const targetsData = [
    { label: 'Your targets', value: 54, id: 1 ,icon: faBullseye},
    { label: 'All targets', value: 75, id: 2, icon:faList },
    { label: 'Advanced targets', value: 30, id: 3, icon:faCalendar },
    // ... add more targets if necessary
  ];

  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle click event
// Function to handle click event
const handleClick = (targetId) => {
  // Check if the first target item is clicked
  if (targetId === 1) {
    // Navigate to '/yourtargets' route
    navigate('/yourtargets');}
    else if(targetId==2){
      navigate('/alltargets');
    }else if(targetId==3){
      navigate('/advancedtargets');}

  
    }

    
    const profileStyle = {
      
      marginBottomTargets: {
          marginBottom: '-10em'
      },
  };



    return (
      <div className="targets-container" style={{...profileStyle.marginBottomTargets}}>
        <h1 className="targets-title">Targets</h1>
        <div className="targets-list">
          {targetsData.map(target => (
            <div key={target.id} className="target-item" onClick={() => handleClick(target.id)}>
              <div className="target-label" data-text={target.label}>
                <FontAwesomeIcon icon={target.icon} />
                {target.label}
              </div>
  
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${target.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default Targets;
