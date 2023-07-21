import React from "react";
import PropTypes from "prop-types";

const displayProvider = (value) => {
  if (value === "webex") return "WebEx";
  if (value === "teams") return "Teams";
  return value;
};

export default class VideoProviderInput extends React.PureComponent {
  static propTypes = {
    enabled: PropTypes.bool,
    providers: PropTypes.array,
    visioType: PropTypes.string,
    videoProvider: PropTypes.string.isRequired,
    handleVideoProviderInputChange: PropTypes.func.isRequired,
    detectEnter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    enabled: false,
    providers: null,
  };

  render() {
    const {
      enabled,
      providers,
      visioType,
      videoProvider,
      detectEnter,
      handleVideoProviderInputChange,
    } = this.props;
    if (
      !enabled ||
      ((!providers || !providers.length) && visioType !== "teams")
    ) {
      return null;
    }
    return (
      <div className="row align-items-center justify-content-center no-gutters">
        <div className="col-lg-3">Visioconférence :</div>
        <div className="col-lg-9">
          <p className="reset tm">
            Certains participants seront à distance ? Cette salle est équipée de
            visio et vous permet de les inclure. Choisissez :
          </p>
          <div className="form-group mb-0">
            {(!providers || !providers.length) && visioType === "teams" ? (
              <>
                <div key={visioType} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="provider"
                    value={visioType}
                    id={visioType}
                    onKeyPress={detectEnter}
                    onChange={handleVideoProviderInputChange}
                    checked={videoProvider === visioType}
                  />
                  <label className="form-check-label" htmlFor={visioType}>
                    {displayProvider(visioType)}
                  </label>
                </div>
              </>
            ) : (
              <>
                {providers.map((p) => (
                  <div key={p} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="provider"
                      value={p}
                      id={p}
                      onKeyPress={detectEnter}
                      onChange={handleVideoProviderInputChange}
                      checked={videoProvider === p}
                    />
                    <label className="form-check-label" htmlFor={p}>
                      {displayProvider(p)}
                    </label>
                  </div>
                ))}
              </>
            )}

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="provider"
                value="none"
                id="none"
                onChange={handleVideoProviderInputChange}
                onKeyPress={detectEnter}
                checked={videoProvider === "none"}
              />
              <label className="form-check-label" htmlFor="none">
                Aucune (tous les participants seront sur place)
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
