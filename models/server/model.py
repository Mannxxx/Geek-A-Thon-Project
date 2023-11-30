import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
import joblib
from pathlib import Path
import json

path: Path = Path(__file__).parent.parent.parent

df = pd.read_csv('data/artifacts/medals_new1.csv')
df.drop(columns=['Unnamed: 0'], inplace = True)

with open(path.joinpath('data/artifacts/dict_sex.json'), 'r') as f:
    dict_sex = json.load(f)

with open(path.joinpath('data/artifacts/dict_country.json'), 'r') as f:
    dict_country = json.load(f)

with open(path.joinpath('data/artifacts/dict_season.json'), 'r') as f:
    dict_season = json.load(f)

with open(path.joinpath('data/artifacts/dict_sport.json'), 'r') as f:
    dict_sport = json.load(f)

with open(path.joinpath('data/artifacts/dict_medal.json'), 'r') as f:
    dict_medal = json.load(f)


df['Sex_le'] = df.Sex.apply(lambda x: dict_sex[x])
df['Country_le'] = df.Country.apply(lambda x: dict_country[x])
df['Sport_le'] = df.Sport.apply(lambda x: dict_sport[x])
df['Season_le'] = df.Season.apply(lambda x: dict_season[x])
df['Medal_le'] = df.Medal.apply(lambda x: dict_medal[x])


inputs = df[['Sex_le', 'Age', 'Height', 'Weight', 'Country_le', 'Sport_le', 'Season_le']]
target = df['Medal_le']


x_train, x_test, y_train, y_test = train_test_split(inputs, target, test_size = 0.2)
model_gbc1 = GradientBoostingClassifier(learning_rate=0.1, n_estimators=290, max_depth=5, min_samples_split=2, min_samples_leaf=1)

model_gbc1.fit(x_train.values, y_train.values)

print(f'Training score = {model_gbc1.score(x_train.values, y_train.values)}')
print(f'Test score = {model_gbc1.score(x_test.values, y_test.values)}')


joblib_file = 'joblib_model_gbc1.pickle'
joblib.dump(model_gbc1, joblib_file)