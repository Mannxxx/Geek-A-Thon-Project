import pandas as pd
from typing import Union
from pathlib import Path
from exceptions import StatsException

_stats_data: Path = Path(__file__).parent.parent.joinpath("data/stats/stats_data.zip")

df = pd.read_csv(_stats_data)
df.drop(columns=['Unnamed: 0'], inplace=True)


class Player:

    def __init__(self, name: str):
        self.name = name
        self.check_medals = df[(df.Name.str.lower() == self.name.lower())].Medal.value_counts()

    def total_medals(self) -> Union[dict, str]:
        # returns no. of different medals won by the specified player altogether

        if self.check_medals.sum() == 0:
            raise StatsException("This player does not exist")

        medals1 = df[(df.Name.str.lower() == self.name.lower())].Medal.value_counts()
        medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

        for key, values in medals1.items():
            medals[key] = medals1[key]

        medals_total = {}
        lost = medals['No medal']
        medals.pop('No medal')
        medals_total['won'] = medals
        medals_total['lost'] = lost

        return medals_total

    def medals_by_event(self):
        return self.medals_event_individual()

    def medals_by_year(self):
        return self.medals_year_individual()

    def medals_event_individual(self) -> Union[dict, str]:
        # returns no. of different medals won by the specified player in all the participated events

        if self.check_medals.sum() == 0:
            raise StatsException("This player does not exist")

        events = df[(df.Name.str.lower() == self.name.lower())].Event.unique()
        events_medals = {}

        for e in events:
            medals1 = df[(df.Name.str.lower() == self.name.lower()) & (df.Event == e)].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]

            medals_total = {}
            lost = medals['No medal']
            medals.pop('No medal')
            medals_total['won'] = medals
            medals_total['lost'] = lost

            events_medals[e] = medals_total

        return events_medals

    def medals_year_individual(self) -> Union[dict, str]:
        # returns no. of different medals won by the specified player per year of participation

        if self.check_medals.sum() == 0:
            raise StatsException("This player does not exist")

        years = sorted(df[(df.Name.str.lower() == self.name.lower())].Year.unique().tolist())
        years_medals = {}

        for y in years:
            medals1 = df[(df.Name.str.lower() == self.name.lower()) & (df.Year == y)].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]

            medals_total = {}
            lost = medals['No medal']
            medals.pop('No medal')
            medals_total['won'] = medals
            medals_total['lost'] = lost

            years_medals[y] = medals_total

        return years_medals

    def info(self) -> Union[dict, str]:
        # returns basic info of the player

        if self.check_medals.sum() == 0:
            raise StatsException("This player does not exist")

        country = df[(df.Name.str.lower() == self.name.lower())].Country.reset_index(drop=True)[0]
        sports = df[(df.Name.str.lower() == self.name.lower())].Sport.unique().tolist()
        years = sorted(df[(df.Name.str.lower() == self.name.lower())].Year.unique().tolist())

        info = {'Name': self.name, 'Country': country, 'Sports': sports, 'Years': years}

        return info


class Country:

    def __init__(self, country: str):
        self.country = country
        self.check_medals = df[(df.Country.str.lower() == self.country.lower())].Medal.value_counts()

    def total_medals(self) -> Union[dict, str]:
        # returns total medals won by the specified country

        if self.check_medals.sum() == 0:
            raise StatsException("This country does not exist")

        medals1 = df[(df.Country.str.lower() == self.country.lower())].Medal.value_counts()
        medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

        for key, values in medals1.items():
            medals[key] = medals1[key]

        medals_total = {}
        lost = medals['No medal']
        medals.pop('No medal')
        medals_total['won'] = medals
        medals_total['lost'] = lost

        return medals_total

    def medals_by_sport(self):
        return self.medals_per_sport()

    def medals_per_sport(self) -> Union[dict, str]:
        # returns different medals won by the specified country in all sports

        if self.check_medals.sum() == 0:
            raise StatsException("This country does not exist")

        sports = df[(df.Country.str.lower() == self.country.lower())].Sport.unique()
        medals_sport = {}

        for sport in sports:
            medals1 = df[(df.Country.str.lower() == self.country.lower()) & (
                    df.Sport.str.lower() == sport.lower())].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]

            medals_total = {}
            lost = medals['No medal']
            medals.pop('No medal')
            medals_total['won'] = medals
            medals_total['lost'] = lost

            medals_sport[sport] = medals_total

        return medals_sport

    def medals_by_year(self):
        return self.medals_per_year()

    def medals_per_year(self) -> Union[dict, str]:
        # returns different no. of medals won by the specified country per year of participation

        if self.check_medals.sum() == 0:
            raise StatsException("This country does not exist")

        years = sorted(df[(df.Country.str.lower() == self.country.lower())].Year.unique().tolist())
        medals_year = {}

        for year in years:
            medals1 = df[(df.Country.str.lower() == self.country.lower()) & (df.Year == year)].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]

            medals_total = {}
            lost = medals['No medal']
            medals.pop('No medal')
            medals_total['won'] = medals
            medals_total['lost'] = lost

            medals_year[year] = medals_total

        return medals_year

    def top_performers(self):
        return self.medals_per_player()

    def medals_per_player(self) -> Union[dict, str]:
        # returns top 5 performers of the specified country in terms of total medals earned

        if self.check_medals.sum() == 0:
            raise StatsException("This country does not exist")

        names = df[(df.Country.str.lower() == self.country.lower())].Name.unique()

        medals_player = {}

        for name in names:
            medals1 = df[(df.Country.str.lower() == self.country.lower()) & (df.Name == name)].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]
            lost = medals.pop('No medal')

            total = 0
            for key, value in medals.items():
                total += medals[key]

            medals_total = {'won': medals, 'lost': lost, 'Total': total}

            medals_player[name] = medals_total

        return dict(sorted(medals_player.items(), key=lambda x: x[1]['Total'], reverse=True)[:5])


class Sport:

    def __init__(self, sport: str):
        self.sport = sport
        self.check_medals = df[(df.Sport.str.lower() == self.sport.lower())].Medal.value_counts()

    def medals_by_country(self):
        return self.medals_per_country()

    def medals_per_country(self) -> Union[dict, str]:
        # returns top 5 countries in the specified sport depending upon total medals won

        if self.check_medals.sum() == 0:
            raise StatsException("This sport does not exist")

        countries = df[(df.Sport.str.lower() == self.sport.lower())].Country.unique()
        medals_country = {}

        for country in countries:
            medals1 = df[(df.Sport.str.lower() == self.sport.lower()) & (
                    df.Country.str.lower() == country.lower())].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]
            lost = medals.pop('No medal')

            total = 0
            for key, value in medals.items():
                total += medals[key]

            medals_total = {'won': medals, 'lost': lost, 'Total': total}

            medals_country[country] = medals_total

        return dict(sorted(medals_country.items(), key=lambda x: x[1]['Total'], reverse=True)[:5])


class Season:

    def __init__(self, season: str):
        self.season = season
        self.check_medals = df[(df.Season.str.lower() == self.season.lower())].Medal.value_counts()

    def medals_by_country(self):
        return self.medals_per_country()

    def medals_per_country(self) -> Union[dict, str]:

        if self.check_medals.sum() == 0:
            raise StatsException("No such season exist")

        medals_country = {}

        for country in df[(df.Season.str.lower() == self.season.lower())].Country.unique():
            medals1 = df[
                (df.Season.str.lower() == self.season.lower()) & (df.Country == country)].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]
            lost = medals.pop('No medal')

            total = 0
            for key, value in medals.items():
                total += medals[key]

            medals_total = {'won': medals, 'lost': lost, 'Total': total}

            medals_country[country] = medals_total

        # Sort the final dictionary based on the 'Total' value in descending order
        return dict(sorted(medals_country.items(), key=lambda x: x[1]['Total'], reverse=True)[:5])


class Year:

    def __init__(self, year: int):
        self.year = year
        self.check_medals = df[(df.Year == self.year)].Medal.value_counts()

    def medals_by_country(self):
        return self.medals_per_country()

    def top_performers(self):
        return self.medals_per_player()

    def medals_per_country(self) -> Union[dict, str]:
        # returns top 5 performing countries in the specified year based on total medals won

        if self.year > 2016:
            raise StatsException('No data available after 2016')
        elif self.check_medals.sum() == 0:
            raise StatsException(f'Olympic games were not conducted in {self.year}')

        countries = df[(df.Year == self.year)].Country.unique()
        medals_country = {}

        for country in countries:
            medals1 = df[(df.Year == self.year) & (df.Country == country)].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]
            lost = medals.pop('No medal')

            total = 0
            for key, value in medals.items():
                total += medals[key]

            medals_total = {'won': medals, 'lost': lost, 'Total': total}

            medals_country[country] = medals_total

        # Sort the final dictionary based on the 'Total' value in descending order
        return dict(sorted(medals_country.items(), key=lambda x: x[1]['Total'], reverse=True)[:5])

    def medals_per_player(self) -> dict:
        # returns top 5 performers of the specified year in terms of total medals earned

        if (self.year > 2016):
            raise StatsException('No data available after 2016')
        elif (self.check_medals.sum() == 0):
            raise StatsException(f'Olympic games were not conducted in {self.year}')

        names = df[(df.Year == self.year)].Name.unique()

        medals_player = {}

        for name in names:
            medals1 = df[(df.Year == self.year) & (df.Name == name)].Medal.value_counts()
            medals = {'Bronze': 0, 'Gold': 0, 'No medal': 0, 'Silver': 0}

            for key, values in medals1.items():
                medals[key] = medals1[key]
            lost = medals.pop('No medal')

            total = 0
            for key, value in medals.items():
                total += medals[key]

            medals_total = {}
            medals_total['won'] = medals
            medals_total['lost'] = lost

            medals_total['Total'] = total

            medals_player[name] = medals_total

        def get_total(d):
            return d['Total']

        # Sort the final dictionary based on the 'Total' value in descending order
        return dict(sorted(medals_player.items(), key=lambda x: get_total(x[1]), reverse=True)[:5])


if __name__ == '__main__':
    ...
    # import json
    # import numpy as np
    #
    # class NumpyJSONEncoder(json.JSONEncoder):
    #     def default(self, obj):
    #         if isinstance(obj, np.integer):
    #             return int(obj)
    #         if isinstance(obj, np.ndarray):
    #             return obj.tolist()  # Convert numpy arrays to lists
    #         return super().default(obj)
    #
    # player = Country("India")
    # print(json.dumps(player.medals_by_year(), cls=NumpyJSONEncoder))
    # player1 = Player('Christine Jacoba Aaftink')
    # print(player1.medals_year_individual())

    print(Player('Christine Jacoba Aaftink').medals_year_individual())



