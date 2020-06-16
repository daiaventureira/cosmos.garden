#!/bin/sh

rm -rf cosmos_garden_prediction.egg-info dist;
python setup.py sdist --formats=gztar;

gsutil rm gs://cosmos.garden/cosmos_garden_prediction-0.1.tar.gz;
gsutil cp dist/cosmos_garden_prediction-0.1.tar.gz gs://cosmos.garden;

# gcloud ai-platform models delete horoscope --project decent-vertex-280500;
# gcloud ai-platform models create horoscope --project decent-vertex-280500 --enable-loggin;

gcloud beta ai-platform versions delete v1 --model horoscope --project decent-vertex-280500;
gcloud beta ai-platform versions create v1 --project decent-vertex-280500 --model horoscope --runtime-version 1.15 --python-version 3.7 --origin gs://cosmos.garden --package-uris gs://cosmos.garden/cosmos_garden_prediction-0.1.tar.gz --prediction-class predictor.Predictor;

# gcloud logging read projects/decent-vertex-280500/logs/ml.googleapis.com --project decent-vertex-280500;

# gcloud ai-platform predict --model horoscope --version v1 --json-instances i.json --project decent-vertex-280500;
