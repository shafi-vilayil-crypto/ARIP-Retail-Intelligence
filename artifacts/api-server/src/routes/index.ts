import { Router, type IRouter } from "express";
import healthRouter from "./health";
import locationsRouter from "./locations";
import marketsRouter from "./markets";
import competitorsRouter from "./competitors";
import scoringRouter from "./scoring";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(locationsRouter);
router.use(marketsRouter);
router.use(competitorsRouter);
router.use(scoringRouter);
router.use(dashboardRouter);

export default router;
