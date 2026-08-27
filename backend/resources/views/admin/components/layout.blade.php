<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <title>Mens-est Internal Tool | @yield('title')</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta content="Mens-est Internal Tool" name="description" />
  <meta content="" name="author" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <!-- App favicon -->
  <link rel="shortcut icon" href="{{ asset('assets/images/favicon.ico') }}">

  <!-- App css -->
  <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" />
  <link href="{{ asset('assets/css/icons.min.css') }}" rel="stylesheet" type="text/css" />
  <link href="{{ asset('assets/css/app.min.css') }}" rel="stylesheet" type="text/css" />

  @yield('style')
</head>

<body id="body" class="enlarge-menu">
  <!-- sidebar -->
  <div class="leftbar-tab-menu">
    <div class="main-icon-menu">
      <a href="#" class="logo logo-metrica d-block text-center">
          <span>
              <img src="{{ asset('assets/images/logo-sm.png') }}" alt="logo-small" class="logo-sm">
          </span>
      </a>
      <div class="main-icon-menu-body">
        <div class="position-reletive h-100" data-simplebar style="overflow-x: hidden;">
          <ul class="nav nav-tabs" role="tablist" id="tab-menu">
            <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard" data-bs-trigger="hover">
              <a href="#MetricaDashboard" id="dashboard-tab" class="nav-link">
                <i class="ti ti-smart-home menu-icon"></i>
              </a><!--end nav-link-->
            </li><!--end nav-item-->
            <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Apps" data-bs-trigger="hover">
              <a href="#MetricaApps" id="apps-tab" class="nav-link">
                <i class="ti ti-apps menu-icon"></i>
              </a><!--end nav-link-->
            </li><!--end nav-item-->

            <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Uikit" data-bs-trigger="hover">
              <a href="#MetricaUikit" id="uikit-tab" class="nav-link">
                <i class="ti ti-planet menu-icon"></i>
              </a><!--end nav-link-->
            </li><!--end nav-item-->

            <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Pages" data-bs-trigger="hover">
              <a href="#MetricaPages" id="pages-tab" class="nav-link">
                <i class="ti ti-files menu-icon"></i>
              </a><!--end nav-link-->
            </li><!--end nav-item-->

            <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Authentication" data-bs-trigger="hover">
              <a href="#MetricaAuthentication" id="authentication-tab" class="nav-link">
                <i class="ti ti-shield-lock menu-icon"></i>
              </a><!--end nav-link-->
            </li><!--end nav-item-->
          </ul>
        </div>
      </div>
      <div class="pro-metrica-end">
        <a href="" class="profile">
          <img src="{{ asset('assets/images/users/user-4.jpg') }}" alt="profile-user" class="rounded-circle thumb-sm">
        </a>
      </div><!--end pro-metrica-end-->
    </div>
  </div>

  <!-- Top Bar Start -->
  <div class="topbar">
    <!-- Navbar -->
    <nav class="navbar-custom" id="navbar-custom">
      <ul class="list-unstyled topbar-nav float-end mb-0">
        <li class="dropdown">
          <a class="nav-link dropdown-toggle arrow-none nav-icon" data-bs-toggle="dropdown" href="#" role="button"
             aria-haspopup="false" aria-expanded="false">
            <img src="{{ asset('assets/images/flags/us_flag.jpg') }}" alt="" class="thumb-xxs rounded-circle">
          </a>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="#"><img src="{{ asset('assets/images/flags/us_flag.jpg') }} " alt="" height="15" class="me-2">English</a>
            <a class="dropdown-item" href="#"><img src="{{ asset('assets/images/flags/spain_flag.jpg') }} " alt="" height="15" class="me-2">Spanish</a>
            <a class="dropdown-item" href="#"><img src="{{ asset('assets/images/flags/germany_flag.jpg') }} " alt="" height="15" class="me-2">German</a>
            <a class="dropdown-item" href="#"><img src="{{ asset('assets/images/flags/french_flag.jpg') }} " alt="" height="15" class="me-2">French</a>
          </div>
        </li><!--end topbar-language-->

        <li class="dropdown notification-list">
          <a class="nav-link dropdown-toggle arrow-none nav-icon" data-bs-toggle="dropdown" href="#" role="button"
             aria-haspopup="false" aria-expanded="false">
            <i class="ti ti-mail"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-end dropdown-lg pt-0">

            <h6 class="dropdown-item-text font-15 m-0 py-3 border-bottom d-flex justify-content-between align-items-center">
              Emails <span class="badge bg-soft-primary badge-pill">3</span>
            </h6>
            <div class="notification-menu" data-simplebar>
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">2 min ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <img src="{{ asset('assets/images/users/user-1.jpg') }}" alt="" class="thumb-sm rounded-circle">
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">Your order is placed</h6>
                    <small class="text-muted mb-0">Dummy text of the printing and industry.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">10 min ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <img src="{{ asset('assets/images/users/user-4.jpg') }}" alt="" class="thumb-sm rounded-circle">
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">Meeting with designers</h6>
                    <small class="text-muted mb-0">It is a long established fact that a reader.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">40 min ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <img src="{{ asset('assets/images/users/user-2.jpg') }}" alt="" class="thumb-sm rounded-circle">
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">UX 3 Task complete.</h6>
                    <small class="text-muted mb-0">Dummy text of the printing.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">1 hr ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <img src="assets/images/users/user-5.jpg" alt="" class="thumb-sm rounded-circle">
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">Your order is placed</h6>
                    <small class="text-muted mb-0">It is a long established fact that a reader.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">2 hrs ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <img src="assets/images/users/user-3.jpg" alt="" class="thumb-sm rounded-circle">
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">Payment Successfull</h6>
                    <small class="text-muted mb-0">Dummy text of the printing.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
            </div>
            <!-- All-->
            <a href="javascript:void(0);" class="dropdown-item text-center text-primary">
              View all <i class="fi-arrow-right"></i>
            </a>
          </div>
        </li>

        <li class="dropdown notification-list">
          <a class="nav-link dropdown-toggle arrow-none nav-icon" data-bs-toggle="dropdown" href="#" role="button"
             aria-haspopup="false" aria-expanded="false">
            <i class="ti ti-bell"></i>
            <span class="alert-badge"></span>
          </a>
          <div class="dropdown-menu dropdown-menu-end dropdown-lg pt-0">

            <h6 class="dropdown-item-text font-15 m-0 py-3 border-bottom d-flex justify-content-between align-items-center">
              Notifications <span class="badge bg-soft-primary badge-pill">2</span>
            </h6>
            <div class="notification-menu" data-simplebar>
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">2 min ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <i class="ti ti-chart-arcs"></i>
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">Your order is placed</h6>
                    <small class="text-muted mb-0">Dummy text of the printing and industry.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">10 min ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <i class="ti ti-device-computer-camera"></i>
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">Meeting with designers</h6>
                    <small class="text-muted mb-0">It is a long established fact that a reader.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">40 min ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <i class="ti ti-diamond"></i>
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">UX 3 Task complete.</h6>
                    <small class="text-muted mb-0">Dummy text of the printing.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">1 hr ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <i class="ti ti-drone"></i>
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">Your order is placed</h6>
                    <small class="text-muted mb-0">It is a long established fact that a reader.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
              <!-- item-->
              <a href="#" class="dropdown-item py-3">
                <small class="float-end text-muted ps-2">2 hrs ago</small>
                <div class="media">
                  <div class="avatar-md bg-soft-primary">
                    <i class="ti ti-users"></i>
                  </div>
                  <div class="media-body align-self-center ms-2 text-truncate">
                    <h6 class="my-0 fw-normal text-dark">Payment Successfull</h6>
                    <small class="text-muted mb-0">Dummy text of the printing.</small>
                  </div><!--end media-body-->
                </div><!--end media-->
              </a><!--end-item-->
            </div>
            <!-- All-->
            <a href="javascript:void(0);" class="dropdown-item text-center text-primary">
              View all <i class="fi-arrow-right"></i>
            </a>
          </div>
        </li>

        <li class="dropdown">
          <a class="nav-link dropdown-toggle nav-user" data-bs-toggle="dropdown" href="#" role="button"
             aria-haspopup="false" aria-expanded="false">
            <div class="d-flex align-items-center">
              <img src="{{ asset('assets/images/users/user-4.jpg') }}" alt="profile-user" class="rounded-circle me-2 thumb-sm" />
              <div>
                <small class="d-none d-md-block font-11">Admin</small>
                <span class="d-none d-md-block fw-semibold font-12">Maria Gibson <i
                          class="mdi mdi-chevron-down"></i></span>
              </div>
            </div>
          </a>
          <div class="dropdown-menu dropdown-menu-end">
            <a class="dropdown-item" href="#"><i class="ti ti-user font-16 me-1 align-text-bottom"></i> Profile</a>
            <a class="dropdown-item" href="#"><i class="ti ti-settings font-16 me-1 align-text-bottom"></i> Settings</a>
            <div class="dropdown-divider mb-0"></div>
            <a class="dropdown-item" href="#"><i class="ti ti-power font-16 me-1 align-text-bottom"></i> Logout</a>
          </div>
        </li><!--end topbar-profile-->
        <li class="notification-list">
          <a class="nav-link arrow-none nav-icon offcanvas-btn" href="#" data-bs-toggle="offcanvas" data-bs-target="#Appearance" role="button" aria-controls="Rightbar">
            <i class="ti ti-settings ti-spin"></i>
          </a>
        </li>
      </ul><!--end topbar-nav-->

      <ul class="list-unstyled topbar-nav mb-0">
        <li>
          <button class="nav-link button-menu-mobile nav-icon" id="togglemenu__tmp">
            <i class="ti ti-menu-2"></i>
          </button>
        </li>
{{--        <li class="hide-phone app-search">--}}
{{--          <form role="search" action="#" method="get">--}}
{{--            <input type="search" name="search" class="form-control top-search mb-0" placeholder="Type text...">--}}
{{--            <button type="submit"><i class="ti ti-search"></i></button>--}}
{{--          </form>--}}
{{--        </li>--}}
      </ul>
    </nav>
    <!-- end navbar-->
  </div>
  <!-- Top Bar End -->

  <!-- Page Content-->
  <div class="page-wrapper">
    <div class="page-content-tab">
      @yield('content')
    </div>
  </div>

  <script src="{{ asset('assets/libs/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
  <script src="{{ asset('assets/libs/simplebar/simplebar.min.js') }}"></script>
  <script src="{{ asset('assets/libs/feather-icons/feather.min.js') }}"></script>

  <script src="{{ asset('assets/libs/apexcharts/apexcharts.min.js') }}"></script>
  <script src="{{ asset('assets/js/pages/analytics-index.init.js') }}"></script>
  <!-- App js -->
  <script src="{{ asset('assets/js/app.js') }}"></script>
  @yield('script')

</body>
<!--end body-->
</html>