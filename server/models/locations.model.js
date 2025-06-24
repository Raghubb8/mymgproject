import { pool } from '../config/db.js';

class LocationModel {
  // ==================== CONTINENT METHODS ====================
  
  // Get all continents
  static async getContinents() {
    try {
      const query = `
        SELECT id, name, code, display_order, is_active, created_at, updated_at
        FROM continents 
        ORDER BY display_order ASC, name ASC
      `;
      const result = await pool.query(query);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get continents error:', error);
      return { success: false, error: 'Failed to fetch continents' };
    }
  }

  // Create continent
  static async createContinent(continentData) {
    try {
      const { name, code, display_order = 0 } = continentData;
      const query = `
        INSERT INTO continents (name, code, display_order)
        VALUES ($1, $2, $3)
        RETURNING id, name, code, display_order, is_active, created_at, updated_at
      `;
      const result = await pool.query(query, [name, code, display_order]);
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Create continent error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'Continent name or code already exists' };
      }
      return { success: false, error: 'Failed to create continent' };
    }
  }

  // Update continent
  static async updateContinent(continentId, continentData) {
    try {
      const { name, code, display_order, is_active } = continentData;
      const query = `
        UPDATE continents 
        SET name = $1, code = $2, display_order = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, name, code, display_order, is_active, created_at, updated_at
      `;
      const result = await pool.query(query, [name, code, display_order, is_active, continentId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Continent not found' };
      }
      
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Update continent error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'Continent name or code already exists' };
      }
      return { success: false, error: 'Failed to update continent' };
    }
  }

  // Delete continent
  static async deleteContinent(continentId) {
    try {
      const query = 'DELETE FROM continents WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [continentId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Continent not found' };
      }
      
      return { success: true, message: 'Continent deleted successfully' };
    } catch (error) {
      console.error('Delete continent error:', error);
      if (error.code === '23503') {
        return { success: false, error: 'Cannot delete continent. It has associated countries.' };
      }
      return { success: false, error: 'Failed to delete continent' };
    }
  }

  // ==================== COUNTRY METHODS ====================
  
  // Get all countries
  static async getCountries() {
    try {
      const query = `
        SELECT 
          c.id, c.name, c.code, c.currency, c.flag_image, c.iso_code, 
          c.nationality, c.display_order, c.is_active, c.created_at, c.updated_at,
          cont.name as continent_name, cont.id as continent_id
        FROM countries c
        LEFT JOIN continents cont ON c.continent_id = cont.id
        ORDER BY c.display_order ASC, c.name ASC
      `;
      const result = await pool.query(query);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get countries error:', error);
      return { success: false, error: 'Failed to fetch countries' };
    }
  }

  // Get countries by continent
  static async getCountriesByContinent(continentId) {
    try {
      const query = `
        SELECT 
          c.id, c.name, c.code, c.currency, c.flag_image, c.iso_code, 
          c.nationality, c.display_order, c.is_active, c.created_at, c.updated_at
        FROM countries c
        WHERE c.continent_id = $1 AND c.is_active = true
        ORDER BY c.display_order ASC, c.name ASC
      `;
      const result = await pool.query(query, [continentId]);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get countries by continent error:', error);
      return { success: false, error: 'Failed to fetch countries' };
    }
  }

  // Create country
  static async createCountry(countryData) {
    try {
      const { 
        continent_id, name, code, currency, flag_image, 
        iso_code, nationality, display_order = 0 
      } = countryData;
      
      const query = `
        INSERT INTO countries (continent_id, name, code, currency, flag_image, iso_code, nationality, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, continent_id, name, code, currency, flag_image, iso_code, nationality, display_order, is_active, created_at, updated_at
      `;
      
      const result = await pool.query(query, [
        continent_id, name, code, currency, flag_image, iso_code, nationality, display_order
      ]);
      
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Create country error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'Country code already exists' };
      }
      if (error.code === '23503') {
        return { success: false, error: 'Invalid continent selected' };
      }
      return { success: false, error: 'Failed to create country' };
    }
  }

  // Update country
  static async updateCountry(countryId, countryData) {
    try {
      const { 
        continent_id, name, code, currency, flag_image, 
        iso_code, nationality, display_order, is_active 
      } = countryData;
      
      const query = `
        UPDATE countries 
        SET continent_id = $1, name = $2, code = $3, currency = $4, flag_image = $5, 
            iso_code = $6, nationality = $7, display_order = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING id, continent_id, name, code, currency, flag_image, iso_code, nationality, display_order, is_active, created_at, updated_at
      `;
      
      const result = await pool.query(query, [
        continent_id, name, code, currency, flag_image, iso_code, nationality, display_order, is_active, countryId
      ]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Country not found' };
      }
      
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Update country error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'Country code already exists' };
      }
      if (error.code === '23503') {
        return { success: false, error: 'Invalid continent selected' };
      }
      return { success: false, error: 'Failed to update country' };
    }
  }

  // Delete country
  static async deleteCountry(countryId) {
    try {
      const query = 'DELETE FROM countries WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [countryId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Country not found' };
      }
      
      return { success: true, message: 'Country deleted successfully' };
    } catch (error) {
      console.error('Delete country error:', error);
      if (error.code === '23503') {
        return { success: false, error: 'Cannot delete country. It has associated states.' };
      }
      return { success: false, error: 'Failed to delete country' };
    }
  }

  // Get country by ID
  static async getCountryById(countryId) {
    try {
      const query = `
        SELECT 
          c.id, c.name, c.code, c.currency, c.flag_image, c.iso_code, 
          c.nationality, c.display_order, c.is_active, c.created_at, c.updated_at,
          cont.name as continent_name, cont.id as continent_id
        FROM countries c
        LEFT JOIN continents cont ON c.continent_id = cont.id
        WHERE c.id = $1
      `;
      const result = await pool.query(query, [countryId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Country not found' };
      }
      
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Get country by ID error:', error);
      return { success: false, error: 'Failed to fetch country' };
    }
  }

  // ==================== STATE METHODS ====================

  // Get all states
  static async getStates() {
    try {
      const query = `
        SELECT
          s.id, s.name, s.code, s.display_order, s.is_active, s.created_at, s.updated_at,
          c.name as country_name, c.id as country_id,
          cont.name as continent_name
        FROM states s
        LEFT JOIN countries c ON s.country_id = c.id
        LEFT JOIN continents cont ON c.continent_id = cont.id
        ORDER BY s.display_order ASC, s.name ASC
      `;
      const result = await pool.query(query);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get states error:', error);
      return { success: false, error: 'Failed to fetch states' };
    }
  }

  // Get states by country
  static async getStatesByCountry(countryId) {
    try {
      const query = `
        SELECT
          s.id, s.name, s.code, s.display_order, s.is_active, s.created_at, s.updated_at,
          c.name as country_name
        FROM states s
        LEFT JOIN countries c ON s.country_id = c.id
        WHERE s.country_id = $1
        ORDER BY s.display_order ASC, s.name ASC
      `;
      const result = await pool.query(query, [countryId]);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get states by country error:', error);
      return { success: false, error: 'Failed to fetch states' };
    }
  }

  // Create state
  static async createState(stateData) {
    try {
      const { country_id, name, code, display_order = 0 } = stateData;
      const query = `
        INSERT INTO states (country_id, name, code, display_order)
        VALUES ($1, $2, $3, $4)
        RETURNING id, country_id, name, code, display_order, is_active, created_at, updated_at
      `;
      const result = await pool.query(query, [country_id, name, code, display_order]);
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Create state error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'State name already exists in this country' };
      }
      if (error.code === '23503') {
        return { success: false, error: 'Invalid country selected' };
      }
      return { success: false, error: 'Failed to create state' };
    }
  }

  // Update state
  static async updateState(stateId, stateData) {
    try {
      const { country_id, name, code, display_order, is_active } = stateData;
      const query = `
        UPDATE states
        SET country_id = $1, name = $2, code = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING id, country_id, name, code, display_order, is_active, created_at, updated_at
      `;
      const result = await pool.query(query, [country_id, name, code, display_order, is_active, stateId]);

      if (result.rows.length === 0) {
        return { success: false, error: 'State not found' };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Update state error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'State name already exists in this country' };
      }
      if (error.code === '23503') {
        return { success: false, error: 'Invalid country selected' };
      }
      return { success: false, error: 'Failed to update state' };
    }
  }

  // Delete state
  static async deleteState(stateId) {
    try {
      const query = 'DELETE FROM states WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [stateId]);

      if (result.rows.length === 0) {
        return { success: false, error: 'State not found' };
      }

      return { success: true, message: 'State deleted successfully' };
    } catch (error) {
      console.error('Delete state error:', error);
      if (error.code === '23503') {
        return { success: false, error: 'Cannot delete state. It has associated districts.' };
      }
      return { success: false, error: 'Failed to delete state' };
    }
  }

  // ==================== DISTRICT METHODS ====================

  // Get all districts
  static async getDistricts() {
    try {
      const query = `
        SELECT
          d.id, d.name, d.code, d.display_order, d.is_active, d.created_at, d.updated_at,
          s.name as state_name, s.id as state_id,
          c.name as country_name,
          cont.name as continent_name
        FROM districts d
        LEFT JOIN states s ON d.state_id = s.id
        LEFT JOIN countries c ON s.country_id = c.id
        LEFT JOIN continents cont ON c.continent_id = cont.id
        ORDER BY d.display_order ASC, d.name ASC
      `;
      const result = await pool.query(query);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get districts error:', error);
      return { success: false, error: 'Failed to fetch districts' };
    }
  }

  // Get districts by state
  static async getDistrictsByState(stateId) {
    try {
      const query = `
        SELECT
          d.id, d.name, d.code, d.display_order, d.is_active, d.created_at, d.updated_at,
          s.name as state_name
        FROM districts d
        LEFT JOIN states s ON d.state_id = s.id
        WHERE d.state_id = $1
        ORDER BY d.display_order ASC, d.name ASC
      `;
      const result = await pool.query(query, [stateId]);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get districts by state error:', error);
      return { success: false, error: 'Failed to fetch districts' };
    }
  }

  // Create district
  static async createDistrict(districtData) {
    try {
      const { state_id, name, code, display_order = 0 } = districtData;
      const query = `
        INSERT INTO districts (state_id, name, code, display_order)
        VALUES ($1, $2, $3, $4)
        RETURNING id, state_id, name, code, display_order, is_active, created_at, updated_at
      `;
      const result = await pool.query(query, [state_id, name, code, display_order]);
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Create district error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'District name already exists in this state' };
      }
      if (error.code === '23503') {
        return { success: false, error: 'Invalid state selected' };
      }
      return { success: false, error: 'Failed to create district' };
    }
  }

  // Update district
  static async updateDistrict(districtId, districtData) {
    try {
      const { state_id, name, code, display_order, is_active } = districtData;
      const query = `
        UPDATE districts
        SET state_id = $1, name = $2, code = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING id, state_id, name, code, display_order, is_active, created_at, updated_at
      `;
      const result = await pool.query(query, [state_id, name, code, display_order, is_active, districtId]);

      if (result.rows.length === 0) {
        return { success: false, error: 'District not found' };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Update district error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'District name already exists in this state' };
      }
      if (error.code === '23503') {
        return { success: false, error: 'Invalid state selected' };
      }
      return { success: false, error: 'Failed to update district' };
    }
  }

  // Delete district
  static async deleteDistrict(districtId) {
    try {
      const query = 'DELETE FROM districts WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [districtId]);

      if (result.rows.length === 0) {
        return { success: false, error: 'District not found' };
      }

      return { success: true, message: 'District deleted successfully' };
    } catch (error) {
      console.error('Delete district error:', error);
      return { success: false, error: 'Failed to delete district' };
    }
  }
}

export default LocationModel;
