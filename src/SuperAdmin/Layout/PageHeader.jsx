import { Link } from 'react-router-dom';

const PageHeader = ({ title, buttonText, buttonIcon, buttonLink, onButtonClick, breadcrumbs = [] }) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        {breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb\" className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li
                  key={index}
                  className={`breadcrumb-item ${
                    index === breadcrumbs.length - 1 ? 'active' : ''
                  }`}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {index === breadcrumbs.length - 1 ? (
                    crumb.label
                  ) : (
                    <Link to={crumb.link}>{crumb.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="h3 mb-0">{title}</h1>
      </div>
      
      {buttonText && (
        buttonLink ? (
          <Link to={buttonLink} className="btn btn-primary mt-3 mt-md-0">
            {buttonIcon && <i className={`bi ${buttonIcon} me-1`}></i>}
            {buttonText}
          </Link>
        ) : (
          <button 
            className="btn btn-primary mt-3 mt-md-0" 
            onClick={onButtonClick}
          >
            {buttonIcon && <i className={`bi ${buttonIcon} me-1`}></i>}
            {buttonText}
          </button>
        )
      )}
    </div>
  );
};

export default PageHeader;