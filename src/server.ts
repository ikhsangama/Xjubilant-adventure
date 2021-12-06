import express from 'express';
import 'reflect-metadata'; // for TypeORM
import bodyParser from "body-parser";
import { connect } from "./utilities/db-connect";
import {getCustomRepository} from "typeorm";
import {BusinessSettingRepository} from "./repositories/businessSetting";
import {BusinessSettingService} from "./services/businessSetting";
import {BusinessSettingController} from "./controllers/businessSetting";
import {errHandler} from "./middlewares/error-handler";
import { NotificationRepository } from "./repositories/notification";
import { NotificationService } from "./services/notification";
import { NotificationController } from "./controllers/notification";

(async () => {
        const app = express();
        const PORT = process.env.EXPRESS_PORT || 3000;

        await connect()

        //Repositories
        const businessSettingRepo = getCustomRepository(BusinessSettingRepository);
        const notificationRepo = getCustomRepository(NotificationRepository);


          //Services
        const businessSettingService = new BusinessSettingService(businessSettingRepo);
        const notificationService = new NotificationService(notificationRepo, businessSettingRepo);

        //Controllers
        const businessSettingController = new BusinessSettingController(businessSettingService);
        const notificationController = new NotificationController(notificationService);

        app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
        app.use(bodyParser.urlencoded({ extended: true }));

        app.get('/', (req, res) => res.send('Express + TypeScript Server'));

        // Routes
        app.use('/api/business/settings', businessSettingController.getRouter());
        app.use('/api/business/notifications', notificationController.getRouter());
        app.use(errHandler);

        app.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
        });
    }
)();
