import { NextResponse } from 'next/server';

export async function GET() {
    const data = {
        "correlationId": "3678971d6-eee4-4b1b-beee-8c61c193931e",
        "statusCode": 200,
        "statusReason": "OK",
        "success": true,
        "status": "OK",
        "moduleDataList": [
            // {
            //     "id": "xxxxxxxxxxxxxxxxxxx",
            //     "moduleName": "Bulk Upload/Download",
            //     "moduleDescription": "Here you can bulk upload & download Artifacts, Datasets",
            //     "moduleImagePath": "/assets/images/Bulk_upload.jpg",
            //     "moduleUri": "/home/bulkupload",
            //     "moduleIsDisabled": false,
            //     "moduleIsHeight": true,
            //     "modulePositionSequence": 2,
            //     "moduleAttribute": "{ 'attributeGroupId': '', 'attributeGroupName': 'Bulk Upload' }",
            //     "roleAccessLevels": [
            //         {
            //             "roleName": "Administrator",
            //             "accessLevel": "Admin",
            //             "priority": 3
            //         }
            //     ]
            // },
            {
                "id": "xxxxxxxxxxxxxxxxxxx",
                "moduleName": "Inbound Purchase Order",
                "moduleDescription": "Available PO data to be ADDed, RENEWed, IGNORed",
                "moduleImagePath": "/assets/images/enterpriseSoftwarePortfolio.png",
                "moduleUri": "/home/viewasset",
                "moduleIsDisabled": false,
                "moduleIsHeight": true,
                "modulePositionSequence": 1,
                "moduleAttribute": "{ attributeGroupId: '', attributeGroupName: 'ITAM Asset table view' }",
                "roleAccessLevels": [
                    {
                        "roleName": "Administrator",
                        "accessLevel": "Admin",
                        "priority": 3
                    }
                ]
            },
            {
                "id": "xxxxxxxxxxxxxxxxxxx",
                "moduleName": "Enterprise Software Portfolio New",
                "moduleDescription": "Baseline and Forecast financial data for expected Enterprise S/W Spend & Pipeline",
                "moduleImagePath": "/assets/images/poProcessing.jpg",
                "moduleUri": "/home/snowFlakePoView",
                "moduleIsDisabled": false,
                "moduleIsHeight": true,
                "modulePositionSequence": 4,
                "moduleAttribute": "{ 'attributeGroupId': '', 'attributeGroupName': 'Purchase Order Processing' }",
                "roleAccessLevels": [
                    {
                        "roleName": "Administrator",
                        "accessLevel": "Admin",
                        "priority": 3
                    }
                ]
            },
            // {
            //     "id": "xxxxxxxxxxxxxxxxxxx",
            //     "moduleName": "Enterprise Software Portfolio New",
            //     "moduleDescription": "Baseline and Forecast financial data for expected Enterprise S/W Spend & Pipeline",
            //     "moduleImagePath": "/assets/images/enterpriseSoftwarePortfolio.png",
            //     "moduleUri": "/home/viewassetnew",
            //     "moduleIsDisabled": false,
            //     "moduleIsHeight": true,
            //     "modulePositionSequence": 15,
            //     "moduleAttribute": "",
            //     "roleAccessLevels": [
            //         {
            //             "roleName": "Administrator",
            //             "accessLevel": "Admin",
            //             "priority": 3
            //         }
            //     ]
            // },
            {
                "id": "xxxxxxxxxxxxxxxxxxx",
                "moduleName": "Financial Analysts PO Portfolio",
                "moduleDescription": "Financial Analysts PO Portfolio",
                "moduleImagePath": "/assets/images/financialAnalystPortfolio.jpg",
                "moduleUri": "/home/financialAnalystsPortfolio",
                "moduleIsDisabled": false,
                "moduleIsHeight": false,
                "modulePositionSequence": 14,
                "moduleAttribute": "{ attributeGroupId: '', attributeGroupName: 'Financial Analysts PO Portfolio' }",
                "roleAccessLevels": [
                    {
                        "roleName": "Administrator",
                        "accessLevel": "Admin",
                        "priority": 3
                    }
                ]
            },
            {
                "id": "xxxxxxxxxxxxxxxxxxx",
                "moduleName": "Portfolio View for Leaders",
                "moduleDescription": "Executive summary of in-year spend across organization levels and funding sources.",
                "moduleImagePath": "/assets/images/leadersView.jpg",
                "moduleUri": "/home/portfolioViewleaders",
                "moduleIsDisabled": false,
                "moduleIsHeight": false,
                "modulePositionSequence": 16,
                "moduleAttribute": "{ attributeGroupId: '', attributeGroupName: 'Leaders View' }",
                "roleAccessLevels": [
                    {
                        "roleName": "Administrator",
                        "accessLevel": "Admin",
                        "priority": 3
                    }
                ]
            }
        ]
    };

    return NextResponse.json(data);
}
