import { Link } from "react-router-dom";

function sentimentIcon({ size }: { size: number }) {
    return (
        <div style={{
            display: 'flex',
            columnGap: 16
        }}>
            <i className={"far fa-smile"} style={{ fontSize: size }}></i>
            <i className={"far fa-meh"} style={{ fontSize: size }}></i>
            <i className={"far fa-angry"} style={{ fontSize: size }}></i>
        </div>
    );
}

const categoryLinks = [{
    title: "Analysis",
    links: [{
        route: "/stats-analysis/predict",
        title: "Medal Prediction",
        iconName: "fa-solid fa-magnifying-glass-chart"
    }, {
        route: "/stats-analysis/sentiment-analysis",
        title: "Sentiment Analysis",
        Icon: sentimentIcon
    }]
}, {
    title: "Statistics",
    links: [{
        route: "/stats-analysis/stats/player",
        title: "Player",
        iconName: "fas fa-running"
    }, {
        route: "/stats-analysis/stats/sports",
        title: "Sports",
        iconName: "fas fa-volleyball-ball"
    }, {
        route: "/stats-analysis/stats/season",
        title: "Season",
        iconName: "fas fa-wind"
    }, {
        route: "/stats-analysis/stats/country",
        title: "Country",
        iconName: "far fa-flag"
    }, {
        route: "/stats-analysis/stats/year",
        title: "Year",
        iconName: "far fa-calendar"
    }]
}]

export function StatsPage() {
    return (
        <>
            {categoryLinks.map((item, index: number) =>
                <div key={index} className="container">
                    <h2 >{item.title}</h2>
                    <div style={{
                        display: 'flex',
                        columnGap: 20,
                        flexWrap: 'wrap',
                        rowGap: 20,
                        marginTop: 40,
                        marginBottom: 40,
                        justifyContent: 'center',
                    }}>{item.links.map(({ route, Icon, iconName, title }, index: number) =>
                        <div
                            key={index}
                            className="col-12 col-lg-8 col-xl-4 stats-analysis-links rounded-3"
                        >
                            <Link
                                to={route}
                                className="btn"
                                style={{
                                    backgroundColor: '#00FF0066',
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    borderColor: '#00FF00',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    padding: 20,
                                    alignItems: 'center',
                                    rowGap: 20,
                                }}>
                                {Icon ?
                                    <Icon size={60} />
                                    : <i className={iconName} style={{ fontSize: 60 }}></i>
                                }
                                <strong>{title}</strong>
                            </Link>
                        </div>
                    )}
                    </div>
                </div>
            )}
        </>
    )
}