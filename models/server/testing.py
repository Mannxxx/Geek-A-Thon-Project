# import joblib
# import blosc
# from transformers import AutoTokenizer
# from transformers import AutoModelForSequenceClassification
# from scipy.special import softmax
#
# MODEL = f"cardiffnlp/twitter-roberta-base-sentiment"
# tokenizer = AutoTokenizer.from_pretrained(MODEL)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL)
#
# joblib_file = 'joblib_model_sa.pickle'
# joblib.dump(model, joblib_file)

# from pathlib import Path
# import requests
# import joblib
#
# path: Path = Path(__file__).parent
#
# model_file = Path("./joblib_model_gbc1.pickle")
#
# if model_file.is_file():
#     __model = joblib.load(path.joinpath('./joblib_model_gbc1.pickle'))
#
# else:
#     medal_predictio_url = 'https://tnow-prod-apac.367791ca7abea81096902b345fee7b1f.r2.cloudflarestorage.com/2023-07-26/0bb0b43b655f9afe256beb1659bad6b5/20230726xc2yWFZN/JSrp88/joblib_model_gbc1.pickle?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=3300106ad320d1c9e7be8252d99fb71b%2F20230726%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20230726T131902Z&X-Amz-Expires=86400&X-Amz-Signature=fa4ec2439710b5c4dd3b447b5b839aaa2071852c22a7acb21fa274ef313ad8e6&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filena'
#     r = requests.get(medal_predictio_url, allow_redirects=True)
#
#     with open('joblib_model_gbc1.pickle', 'wb') as f:
#         f.write(r.content)

from collections import Counter

# Sample list containing the values
your_list = ['positive', 'negative', 'neutral', 'positive', 'positive', 'neutral', 'neutral', 'negative', 'positive']

# Count the occurrences of each value in the list
most_common_value = Counter(your_list).most_common(1)[0][0]

# Get the value with the most occurrences
# most_common_value = value_counts.most_common(1)[0][0]
#
# # Get the count of the most common value
# most_common_count = value_counts[most_common_value]

print("Most common value:", most_common_value)
# print("Number of occurrences:", most_common_count)


