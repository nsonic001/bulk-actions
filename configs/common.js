module.exports = {
  port: '4000',
  user: {
    get: '/o/profile/'
  },
  entity: {
    employer: 'ER'
  },
  employer: {
    actions: {
      mark_absent: 'MA'
    },
    end_points: {
      application: '/api/v4/application/',
      mark_absent: '/mark_absent/'
    }
  }
}