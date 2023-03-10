#!/usr/bin/env bash
aws dynamodb batch-write-item --request-items file://dynamodb/resources/seed-items.json

# aws dynamodb put-item \
#     --table-name shop-cloudx-backend-products-table-dev \
#     --item \
#         '{"id": {"S": "7567ec4b-b10c-48c5-9345-fc73c48a80aa"}, "title": {"S": "Bike"}, "description": {"S": "A bike"}, "price": {"N": "24"}}'

#  aws dynamodb put-item \
#      --table-name shop-cloudx-backend-stocks-table-dev \
#      --item \
#          '{"product_id": {"S": "7567ec4b-b10c-48c5-9345-fc73c48a80aa"}, "count": {"N": "50"}}'

#  aws dynamodb batch-get-item \
#      --request-items \
#          '{"shop-cloudx-backend-stocks-table-dev": {"Keys": [{"product_id": {"S": "7567ec4b-b10c-48c5-9345-fc73c48a80aa"}}]}}'
