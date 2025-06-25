import express from 'express';
import LocationController from '../controllers/locations.controller.js';

const router = express.Router();

// ==================== CONTINENT ROUTES ====================
router.get('/continents', LocationController.getContinents);
router.post('/continents', LocationController.createContinent);
router.put('/continents/:continentId', LocationController.updateContinent);
router.delete('/continents/:continentId', LocationController.deleteContinent);

// ==================== COUNTRY ROUTES ====================
router.get('/countries', LocationController.getCountries);
router.get('/countries/:countryId', LocationController.getCountryById);
router.post('/countries', LocationController.createCountry);
router.put('/countries/:countryId', LocationController.updateCountry);
router.delete('/countries/:countryId', LocationController.deleteCountry);

// ==================== STATE ROUTES ====================
router.get('/states', LocationController.getStates);
router.get('/countries/:countryId/states', LocationController.getStatesByCountry);
router.post('/states', LocationController.createState);
router.put('/states/:stateId', LocationController.updateState);
router.delete('/states/:stateId', LocationController.deleteState);

// ==================== DISTRICT ROUTES ====================
router.get('/districts', LocationController.getDistricts);
router.get('/states/:stateId/districts', LocationController.getDistrictsByState);
router.post('/districts', LocationController.createDistrict);
router.put('/districts/:districtId', LocationController.updateDistrict);
router.delete('/districts/:districtId', LocationController.deleteDistrict);

// ==================== UTILITY ROUTES ====================
router.get('/hierarchy', LocationController.getLocationHierarchy);

// Export router
export default router;
