import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import rdToWgs84 from 'rd-to-wgs84';

const Marker = ({text, color}) => <div style={{
    color: 'white',
    background: `${color}`,
    padding: '5px 5px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
}}>{text}</div>;

const dataDefault = rdToWgs84(121177, 486052);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                results: []
            }
        }
    }

    static defaultProps = {
        center: {
            lat: dataDefault.lat,
            lng: dataDefault.lon
        },
        zoom: 13
    };

    componentDidMount() {
        fetch('https://api.data.amsterdam.nl/monumenten/monumenten/?format=json')
            .then(response => response.json())
            .then(data => this.setState({data}))
    }

    render() {
        const results = this.state.data.results;
        const markerList = results.map(marker => ({
            latLon: rdToWgs84(marker.monumentcoordinaten.coordinates[0], marker.monumentcoordinaten.coordinates[1]),
            status: marker.monumentstatus
        }));

        return (
            <div style={{height: '100vh', width: '100%'}}>
                <GoogleMapReact
                    bootstrapURLKeys={{key: /* your key here */}}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                    {markerList.map(mark =>
                        <Marker
                            lat={mark.latLon.lat}
                            lng={mark.latLon.lon}
                            key={mark.latLon.lat}
                            text=""
                            color={mark.status === 'Rijksmonument' ? 'black' : 'red'}
                        />
                    )}
                </GoogleMapReact>
            </div>
        );
    }
}

export default App;
